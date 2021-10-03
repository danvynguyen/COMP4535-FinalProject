import {
    OrgProvisioning,
    ProvisioningStatus,
    AccountProvisioning,
    VaultProvisioning,
} from "@padloc/core/src/provisioning";
import { $l } from "@padloc/locale/src/translate";
import { html } from "lit";
import { alert } from "./dialog";
import "../elements/markdown-content";
import { app, router } from "../globals";

export async function displayProvisioning({
    status,
    statusMessage,
    actionUrl,
    actionLabel,
}: AccountProvisioning | OrgProvisioning | VaultProvisioning) {
    const options: { action: () => void; label: string }[] = [];
    if (actionUrl) {
        options.push({
            action: () => window.open(actionUrl, "_blank"),
            label: actionLabel || $l("Learn More"),
        });
    }

    if (!!app.session) {
        options.push({
            action: async () => {
                await app.logout();
                router.go("start");
            },
            label: $l("Log Out"),
        });
    }

    if (![ProvisioningStatus.Unprovisioned, ProvisioningStatus.Suspended].includes(status) || !app.account) {
        options.push({ label: $l("Dismiss"), action: () => {} });
    }

    const choice = await alert(html`<pl-markdown-content .content=${statusMessage}></pl-markdown-content>`, {
        icon: null,
        options: options.map((o) => o.label),
        preventDismiss: true,
    });

    options[choice]?.action();
}