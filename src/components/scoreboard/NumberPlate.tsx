import styles from "@/styles/scoreboard.module.css";

interface NumberPlateProps {
  value?: string | number;
  isEmpty?: boolean;
  isRhe?: boolean;
}

export default function NumberPlate({ value, isEmpty, isRhe }: NumberPlateProps) {
  const cls = [
    styles.plate,
    isEmpty ? styles.emptyPlate : "",
    isRhe ? styles.rhePlate : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cls}>{isEmpty ? "" : value}</div>;
}
