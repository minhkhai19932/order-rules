import { type HTMLAttributes } from "react";

/**
 * Card component props.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Card header component props.
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Card title component props.
 */
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

/**
 * Card content component props.
 */
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Reusable card container component with orange brand theme.
 * Provides consistent card styling with shadow and border.
 */
export function Card({ className = "", children, ...props }: CardProps) {
  const baseStyles = "bg-white rounded-lg shadow border border-gray-200";
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}

/**
 * Card header section component.
 * Provides spacing and styling for card headers.
 */
export function CardHeader({
  className = "",
  children,
  ...props
}: CardHeaderProps) {
  const baseStyles = "px-6 py-4 border-b border-gray-200";
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}

/**
 * Card title component.
 * Styled heading for card titles with orange brand accent.
 */
export function CardTitle({
  className = "",
  children,
  ...props
}: CardTitleProps) {
  const baseStyles = "text-lg font-semibold text-gray-900";
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <h3 className={combinedClassName} {...props}>
      {children}
    </h3>
  );
}

/**
 * Card content section component.
 * Provides padding for card content.
 */
export function CardContent({
  className = "",
  children,
  ...props
}: CardContentProps) {
  const baseStyles = "px-6 py-4";
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}
