import type { User } from "@/lib/hooks/useAuth";

/** Student hero + learner discovery rails on `/`. */
export function isLearnerHomeUser(user: Pick<User, "role">): boolean {
    const r = String(user.role ?? "").trim().toLowerCase();
    return r === "student" || (r !== "instructor" && r !== "admin");
}

/** Instructor/admin hero + staff discovery on `/`. */
export function isStaffHomeUser(user: Pick<User, "role">): boolean {
    const r = String(user.role ?? "").trim().toLowerCase();
    return r === "instructor" || r === "admin";
}
