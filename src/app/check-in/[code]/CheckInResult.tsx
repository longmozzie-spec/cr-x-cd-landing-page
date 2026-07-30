"use client";

interface Props {
  result: "success" | "used" | "invalid" | "unpaid";
  message: string;
  fullName?: string;
  checkedInAt?: string;
}

export function CheckInResult({ result, message, fullName, checkedInAt }: Props) {
  const resultClass =
    result === "success"
      ? "ci-success"
      : result === "used"
        ? "ci-used"
        : "ci-error";

  return (
    <div className="ci-page">
      <div className="ci-card">
        <h1 className="ci-title">Check-in</h1>

        <div className={`ci-result ${resultClass}`}>
          <p className="ci-msg">{message}</p>
          {fullName && <p className="ci-name">{fullName}</p>}
          {result === "used" && checkedInAt && (
            <p className="ci-time">
              Check-in lúc {new Date(checkedInAt).toLocaleTimeString("vi-VN")}
            </p>
          )}
          {result === "success" && checkedInAt && (
            <p className="ci-time">
              {new Date(checkedInAt).toLocaleTimeString("vi-VN")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
