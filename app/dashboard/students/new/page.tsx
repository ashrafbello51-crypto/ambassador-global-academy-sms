"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateStudent } from "@/hooks/use-students";
import { createStudentSchema } from "@/lib/validations/student.schema";
import { showToast } from "@/components/ui/Toast";

interface StreamOption { id: string; name: string; }
interface ClassOption { id: string; name: string; category: string; streams: StreamOption[]; }
interface HouseOption { id: string; name: string; color: string | null; }

export default function NewStudentPage() {
  const router = useRouter();
  const { createStudent, loading } = useCreateStudent();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [houses, setHouses] = useState<HouseOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    firstName: "", lastName: "", middleName: "", dateOfBirth: "",
    gender: "", bloodGroup: "", phone: "", email: "", address: "",
    classId: "", streamId: "", houseId: "", medicalNotes: "",
  });

  useEffect(() => {
    fetch("/api/enrollment-data")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setClasses(json.data.classes ?? []);
          setHouses(json.data.houses ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  const selectedClass = classes.find((c) => c.id === form.classId);
  const availableStreams = selectedClass?.streams ?? [];

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = createStudentSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const result = await createStudent(parsed.data);
    if (result) {
      showToast("success", `Student ${result.firstName} ${result.lastName} registered successfully`);
      router.push("/dashboard/students");
    } else {
      showToast("error", "Failed to register student");
    }
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Register New Student</h1>
        <p className="text-gray-500 mt-0.5">Fill in the student details below</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input required value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} className={inputClass("firstName")} />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input required value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} className={inputClass("lastName")} />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
              <input value={form.middleName} onChange={(e) => updateField("middleName", e.target.value)} className={inputClass("middleName")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className={inputClass("dateOfBirth")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => updateField("gender", e.target.value)} className={inputClass("gender")}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select value={form.bloodGroup} onChange={(e) => updateField("bloodGroup", e.target.value)} className={inputClass("bloodGroup")}>
                <option value="">Select</option>
                <option>A+</option><option>A-</option><option>B+</option>
                <option>B-</option><option>O+</option><option>O-</option>
                <option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass("phone")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass("email")} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea rows={2} value={form.address} onChange={(e) => updateField("address", e.target.value)} className={inputClass("address")} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select value={form.classId} onChange={(e) => { updateField("classId", e.target.value); updateField("streamId", ""); }} className={inputClass("classId")} disabled={loadingData}>
                <option value="">{loadingData ? "Loading..." : "Select class"}</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
              <select value={form.streamId} onChange={(e) => updateField("streamId", e.target.value)} className={inputClass("streamId")} disabled={loadingData || !form.classId}>
                <option value="">{!form.classId ? "Select a class first" : "Select stream"}</option>
                {availableStreams.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House</label>
              <select value={form.houseId} onChange={(e) => updateField("houseId", e.target.value)} className={inputClass("houseId")} disabled={loadingData}>
                <option value="">{loadingData ? "Loading..." : "Select house"}</option>
                {houses.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h2>
          <textarea rows={3} value={form.medicalNotes} onChange={(e) => updateField("medicalNotes", e.target.value)}
            placeholder="Allergies, conditions, medications..."
            className={inputClass("medicalNotes")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading}
          className="px-6 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? "Saving..." : "Register Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
