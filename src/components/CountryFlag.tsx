import { createMemo } from "solid-js";

const A_LETTER = 0x1f1e6;

function CountryFlag(props: { countryCode: string }) {
  const flagEmoji = createMemo(() => {
    if (!props.countryCode.match(/^[A-Z]{2}$/)) {
      return <div>Invalid country code "{props.countryCode}"</div>;
    }
    const [first, second] = props.countryCode
      .split("")
      .map((x) => x.charCodeAt(0) - 65);
    return String.fromCodePoint(A_LETTER + first, A_LETTER + second);
  });
  return <span>{flagEmoji()}</span>;
}

export { CountryFlag };
