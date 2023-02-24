export default function Custom404() {
  return (
    <>
      <div
        className="container"
        style={{ marginTop: "40px", maxWidth: "80ex" }}
      >
        <h1>404: Stránka nenalezena</h1>
        <p>
          Je nám líto, ale stránka, o kterou jste požádali, tady není. Co s tím:
        </p>
        <ul>
          <li>
            Pokud jste adresu zadávali přímo, podívejte se, jestli jste se někde
            nepřepsali.
          </li>
          <li>
            Pokud jste přišli odkazem z e-mailu, zkontrolujte, jestli jste ho
            správně zkopírovali nebo jestli ho váš poštovní program nezmrzačil.
          </li>
          <li>Buďte hodnější na své bližní.</li>
        </ul>
        <p>
          Pokud nic z toho nezabírá, zkuste napsat na{" "}
          <a href="mailto:ohlasy@ohlasy.info">ohlasy@ohlasy.info</a>, mrkneme se
          na to.
        </p>
      </div>
    </>
  );
}
