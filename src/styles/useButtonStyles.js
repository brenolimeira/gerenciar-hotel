import { createStyles } from "antd-style";

export const useButtonStyles = createStyles(({ token, css }) => ({
    primaryButton: css`
      background: linear-gradient(135deg,#2563EB,#1D4ED8);
      border:none;
      font-weight:600;
      box-shadow:0 4px 14px rgba(37,99,235,.35);
      transition: all .25s ease;

      &:hover{
        transform: translateY(-2px);
        box-shadow:0 8px 22px rgba(37,99,235,.45);
        filter:brightness(1.05);
      }

      &:active{
        transform: scale(.97);
      }

      &:focus-visible{
        outline:3px solid rgba(37,99,235,.35);
        outline-offset:2px;
      }
    `,

    accentButton: css`
      background: linear-gradient(135deg,#F97316,#EA580C);
      border:none;
      font-weight:600;
      box-shadow:0 4px 14px rgba(249,115,22,.35);
      transition:.25s;

      &:hover{
        transform:translateY(-2px);
        box-shadow:0 8px 22px rgba(249,115,22,.45);
      }

      &:active{
        transform:scale(.97);
      }

      &:focus-visible{
        outline:3px solid rgba(249,115,22,.35);
      }
    `,

    dangerButton: css`
      background: linear-gradient(135deg,#DC2626,#B91C1C);
      border:none;
      font-weight:600;
      box-shadow:0 4px 14px rgba(220,38,38,.35);
      transition:.25s;
      color: #FFF;

      &:hover{
        transform:translateY(-2px);
        box-shadow:0 8px 22px rgba(220,38,38,.45);
      }

      &:active{
        transform:scale(.97);
      }

      &:focus-visible{
        outline:3px solid rgba(220,38,38,.35);
      }
    `
}));