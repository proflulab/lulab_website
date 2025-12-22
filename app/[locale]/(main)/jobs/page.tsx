import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

const FEISHU_JOBS_URL = process.env.NEXT_PUBLIC_FEISHU_JOBS_DOC_URL;

export default async function JobsPage() {
    const docUrl = FEISHU_JOBS_URL;
    if (docUrl) {
        redirect(docUrl);
    }

    const t = await getTranslations("JobsPage");

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {t("title")}
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    {t("missing.desc")}
                </p>
            </div>
        </div>
    );
}
