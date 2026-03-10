"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function CreateFormButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/forms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Untitled Form",
                    description: "Description of your form",
                }),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/dashboard/forms/${data.id}/edit`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCreate}
            disabled={loading}
            className="btn-primary"
            style={{ padding: '0.75rem 1.5rem' }}
        >
            <Plus size={18} />
            {loading ? "Creating..." : "Create Form"}
        </button>
    );
}
