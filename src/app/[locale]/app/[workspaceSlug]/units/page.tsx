import React from "react";
import { getWorkspaceUnits } from "@/actions/unit.actions";
import { UnitsClient } from "./units-client";

interface PageProps {
    params: Promise<{
        workspaceSlug: string;
        locale: string;
    }>;
}

export default async function UnitsPage({ params }: PageProps) {
    const { workspaceSlug } = await params;
    const units = await getWorkspaceUnits(workspaceSlug);

    return (
        <UnitsClient
            units={units}
            workspaceSlug={workspaceSlug}
        />
    );
}
