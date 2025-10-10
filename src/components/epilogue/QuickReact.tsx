"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

/* ---------- 타입 정의 ---------- */
export type QuickIntentKey = "hire" | "interview" | "feedback";

export type QuickReactOption = {
  key: QuickIntentKey;
  icon?: React.ReactNode;
};

type CollectField = "name" | "email" | "company" | "message";
type CollectConfig = Partial<
  Record<QuickIntentKey, ReadonlyArray<CollectField>>
>;

type FormValues = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

type QuickReactProps = {
  options?: ReadonlyArray<QuickReactOption>;
  onSelect?: (intent: QuickIntentKey) => Promise<void> | void;
  apiEndpoint?: string;
  collect?: CollectConfig;
};

/* ---------- 메인 컴포넌트 ---------- */
export default function QuickReact({
  options,
  onSelect,
  apiEndpoint,
  collect,
}: QuickReactProps) {
  const t = useTranslations("epilogue.quick");

  const [pending, setPending] = useState<QuickIntentKey | null>(null);
  const [doneKey, setDoneKey] = useState<QuickIntentKey | null>(null);
  const [error, setError] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIntent, setActiveIntent] = useState<QuickIntentKey | null>(null);

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", company: "", message: "" },
  });

  const items: ReadonlyArray<QuickReactOption> = options ?? [
    { key: "hire" },
    { key: "interview" },
    { key: "feedback" },
  ];

  const requiredFields = useMemo<ReadonlyArray<CollectField>>(() => {
    if (!activeIntent || !collect) return [];
    return collect[activeIntent] ?? [];
  }, [activeIntent, collect]);

  function openForIntent(k: QuickIntentKey) {
    setError("");
    setActiveIntent(k);
    const needsForm = Boolean(collect?.[k]?.length);
    if (needsForm) {
      setModalOpen(true);
    } else {
      void handleSubmitToAPI(k, {});
    }
  }

  async function handleSubmitToAPI(intent: QuickIntentKey, data: FormValues) {
    setError("");
    setPending(intent);
    try {
      await onSelect?.(intent);
      if (apiEndpoint) {
        const payload = {
          intent,
          ...data,
        };
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("bad_response");
      }
      setDoneKey(intent);
      setTimeout(() => setDoneKey(null), 1500);
      setModalOpen(false);
      setActiveIntent(null);
      reset();
    } catch (e) {
      console.error("quick-react error:", e);
      setError(t("error"));
    } finally {
      setPending(null);
    }
  }

  return (
    <section
      aria-labelledby='quick-react-title'
      className='rounded-2xl border border-border bg-card p-6'
    >
      <h3 id='quick-react-title' className='text-lg font-semibold'>
        {t("title")}
      </h3>
      <p className='mt-1 text-sm text-muted-foreground'>{t("desc")}</p>

      {error && (
        <div
          role='alert'
          className='mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700'
        >
          {error}
        </div>
      )}

      <div className='mt-4 grid gap-3 sm:grid-cols-3'>
        {items.map(({ key, icon }) => {
          const isPending = pending === key;
          const isDone = doneKey === key;
          return (
            <button
              key={key}
              type='button'
              data-intent={key}
              aria-pressed={isDone}
              disabled={isPending}
              onClick={() => openForIntent(key)}
              className='flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 transition hover:bg-muted disabled:opacity-60'
            >
              {icon}
              <span>
                {isDone
                  ? t("done")
                  : isPending
                  ? t("sending")
                  : t(`labels.${key}`)}
              </span>
            </button>
          );
        })}
      </div>

      <p className='mt-3 text-xs text-muted-foreground'>{t("note")}</p>

      {/* ---------- 모달 폼 ---------- */}
      {modalOpen && activeIntent && (
        <div
          role='dialog'
          aria-modal='true'
          className='fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm grid place-items-center p-4'
          onClick={() => setModalOpen(false)}
        >
          <div
            className='w-full max-w-md rounded-2xl border bg-card p-5 shadow-xl'
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className='text-base font-semibold'>
              {t(`form.title.${activeIntent}`)}
            </h4>
            <p className='mt-1 text-xs text-muted-foreground'>
              {t("form.desc")}
            </p>

            <form
              onSubmit={handleSubmit((data) =>
                handleSubmitToAPI(activeIntent, data)
              )}
              className='mt-4 space-y-3'
            >
              {requiredFields.includes("name") && (
                <div>
                  <label className='block text-xs mb-1'>
                    {t("form.labels.name")}
                  </label>
                  <input
                    {...register("name", {
                      required: t("form.errors.required"),
                    })}
                    className='w-full rounded-lg border px-3 py-2 bg-background'
                    placeholder={t("form.placeholders.name")}
                  />
                  {errors.name && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}

              {requiredFields.includes("email") && (
                <div>
                  <label className='block text-xs mb-1'>
                    {t("form.labels.email")}
                  </label>
                  <input
                    type='email'
                    {...register("email", {
                      required: t("form.errors.required"),
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: t("form.errors.invalidEmail"),
                      },
                    })}
                    className='w-full rounded-lg border px-3 py-2 bg-background'
                    placeholder={t("form.placeholders.email")}
                  />
                  {errors.email && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}

              {requiredFields.includes("company") && (
                <div>
                  <label className='block text-xs mb-1'>
                    {t("form.labels.company")}
                  </label>
                  <input
                    {...register("company")}
                    className='w-full rounded-lg border px-3 py-2 bg-background'
                    placeholder={t("form.placeholders.company")}
                  />
                </div>
              )}

              {requiredFields.includes("message") && (
                <div>
                  <label className='block text-xs mb-1'>
                    {t("form.labels.message")}
                  </label>
                  <textarea
                    {...register("message", {
                      required: t("form.errors.required"),
                    })}
                    className='w-full rounded-lg border px-3 py-2 bg-background min-h-24'
                    placeholder={t("form.placeholders.message")}
                  />
                  {errors.message && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.message.message}
                    </p>
                  )}
                </div>
              )}

              <div className='mt-5 flex items-center justify-end gap-2'>
                <button
                  type='button'
                  className='rounded-lg border px-3 py-2 text-sm'
                  onClick={() => setModalOpen(false)}
                >
                  {t("form.actions.cancel")}
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='rounded-lg border px-3 py-2 text-sm bg-foreground text-background disabled:opacity-60'
                >
                  {isSubmitting ? t("sending") : t("form.actions.send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
