"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/loading-button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { FormError } from "@/components/ui/form-error"
import { AuthFormConfig } from "@/types/auth-form.types"
import { registerFormSchema, type RegisterFormData } from "@/shared/constants/forms/register"

interface SignupFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  config: AuthFormConfig
  onSubmit?: (data: RegisterFormData) => void | Promise<void>
}

export function SignupForm({
  className,
  config,
  onSubmit: onSubmitProp,
  ...props
}: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      lastname: "",
      firstname: "",
      cabinet_name: "",
      email: "",
      telephone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleSubmit = async (data: RegisterFormData) => {
    if (!onSubmitProp) return

    setIsSubmitting(true)
    try {
      await onSubmitProp(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          {/* Header Section */}
          <div className="flex flex-col items-center gap-1 text-center">
            {config.header.icon && (
              <div className="flex items-center justify-center mb-2">
                {config.header.icon}
              </div>
            )}
            <h1 className="text-2xl font-bold">{config.header.title}</h1>
            <p className="text-muted-foreground text-sm text-balance">
              {config.header.description}
            </p>
          </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="lastname">Nom <span className="text-red-500">*</span></FieldLabel>
            <Input
              {...form.register("lastname")}
              id="lastname"
              type="text"
              placeholder="Dupont"
            />
            <FormError message={form.formState.errors.lastname?.message} />
          </Field>

          <Field>
            <FieldLabel htmlFor="firstname">Prénom <span className="text-red-500">*</span></FieldLabel>
            <Input
              {...form.register("firstname")}
              id="firstname"
              type="text"
              placeholder="Jean"
            />
            <FormError message={form.formState.errors.firstname?.message} />
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel htmlFor="cabinet_name">Nom du Cabinet <span className="text-red-500">*</span></FieldLabel>
            <Input
              {...form.register("cabinet_name")}
              id="cabinet_name"
              type="text"
              placeholder="Cabinet Dupont & Associés"
            />
            <FormError message={form.formState.errors.cabinet_name?.message} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email <span className="text-red-500">*</span></FieldLabel>
            <Input
              {...form.register("email")}
              id="email"
              type="email"
              placeholder="exemple@email.com"
            />
            <FormError message={form.formState.errors.email?.message} />
          </Field>

          <Field>
            <FieldLabel htmlFor="telephone">Téléphone <span className="text-red-500">*</span></FieldLabel>
            <Controller
              name="telephone"
              control={form.control}
              render={({ field }) => (
                <PhoneInput
                  id="telephone"
                  placeholder="77 000 00 00"
                  defaultCountry="SN"
                  countries={["SN"]}
                  countrySelectProps={{ disabled: true }}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <FormError message={form.formState.errors.telephone?.message} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Mot de passe <span className="text-red-500">*</span></FieldLabel>
            <Input
              {...form.register("password")}
              id="password"
              type="password"
              placeholder="*******************"
            />
            <FormError message={form.formState.errors.password?.message} />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe <span className="text-red-500">*</span></FieldLabel>
            <Input
              {...form.register("confirmPassword")}
              id="confirmPassword"
              type="password"
              placeholder="*******************"
            />
            <FormError message={form.formState.errors.confirmPassword?.message} />
          </Field>
        </div>

        {/* Submit Button */}
        <Field className="md:col-span-2">
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
          >
            {config.submitButton.icon}
            {config.submitButton.text}
          </LoadingButton>
        </Field>

        {/* Social Login Section */}
        {config.socialLogin?.enabled && (
          <>
            <FieldSeparator>
              {config.socialLogin.separator || "Or continue with"}
            </FieldSeparator>
            <Field>
              {config.socialLogin.providers?.map((provider, index) => (
                <Button key={index} variant="outline" type="button">
                  {provider.icon}
                  {provider.buttonText}
                </Button>
              ))}
            </Field>
          </>
        )}
        </FieldGroup>
      </form>
    </>
  )
}

export function SignupFormFooter({ config }: { config: AuthFormConfig }) {
  if (!config.footerLink) return null

  return (
    <p className="text-sm text-muted-foreground text-center">
      {config.footerLink.text}{" "}
      {config.footerLink.linkText && (
        <a href={config.footerLink.href} className="underline underline-offset-4">
          {config.footerLink.linkText}
        </a>
      )}
    </p>
  )
}
