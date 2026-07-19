"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface StudentListParams {
  search?: string;
  classId?: string;
  status?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: string;
}

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  class: { id: string; name: string } | null;
  academicStatus: string;
  isActive: boolean;
  enrollmentDate: string;
}

interface StudentListResult {
  students: Student[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

interface StudentDetail {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  bloodGroup: string | null;
  medicalNotes: string | null;
  classId: string | null;
  streamId: string | null;
  houseId: string | null;
  enrollmentDate: string;
  isActive: boolean;
  isArchived: boolean;
  academicStatus: string;
  class: { id: string; name: string } | null;
  stream: { id: string; name: string } | null;
  house: { id: string; name: string } | null;
  parentGuardians: { guardian: { id: string; firstName: string; lastName: string; phone: string; relationship: string } }[];
}

export function useStudents() {
  const [data, setData] = useState<StudentListResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async (params: StudentListParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") searchParams.set(k, String(v));
      });
      const res = await fetch(`/api/students?${searchParams.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to fetch students");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchStudents };
}

export function useStudent(id: string | undefined) {
  const [data, setData] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/students/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to fetch student");
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch student");
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { data, loading, error, fetchStudent };
}

export function useCreateStudent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStudent = useCallback(async (input: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create student");
      return json.data as StudentDetail;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create student");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createStudent, loading, error };
}

export function useUpdateStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStudent = useCallback(async (id: string, input: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to update student");
      return json.data as StudentDetail;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update student");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateStudent, loading, error };
}

export function useDeleteStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStudent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to delete student");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete student");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteStudent, loading, error };
}
