import { useEffect, useRef } from "react";

type Props = {
  onToken: (token: string | null) => void;
};

export default function Turnstile({ onToken }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const wait = () => {
      if (!window.turnstile || !elRef.current) return setTimeout(wait, 50);

      widgetIdRef.current = window.turnstile.render(elRef.current, {
        sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY,
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      });
    };

    wait();

    return () => {
      if (window.turnstile && widgetIdRef.current) window.turnstile.remove(widgetIdRef.current);
    };
  }, [onToken]);

  return <div ref={elRef} />;
}

