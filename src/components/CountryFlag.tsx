const A_LETTER = 0x1f1e6;

function CountryFlag({ countryCode }: { countryCode: string }) {
  if (countryCode.length !== 2) {
    return <div>Invalid country code</div>;
  }
  if (!countryCode.match(/^[A-Z]{2}$/)) {
    return <div>Invalid country code</div>;
  }
  const [first, second] = countryCode
    .split("")
    .map((x) => x.charCodeAt(0) - 65);
  if (!first || !second) {
    return <div>Invalid country code</div>;
  }
  const flag = String.fromCodePoint(A_LETTER + first, A_LETTER + second);
  return <span>{flag}</span>;
}

export { CountryFlag };
