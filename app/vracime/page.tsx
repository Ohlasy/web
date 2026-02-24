const Page = () => (
  <main className="min-h-100 max-w-prose flex flex-col gap-4">
    <h2 className="text-3xl uppercase font-bold">Proč vám vracíme platbu?</h2>
    <p>
      Na tuhle stránku jste se dostali nejspíš kvůli tomu, že jsme vám vrátili
      nějakou platbu zaslanou na{" "}
      <a href="https://ib.fio.cz/ib/transparent?a=2601715895">náš účet</a>.
    </p>
    <p>
      Pokud nám chcete přispět na provoz, jsme moc rádi, díky! Ale neoznačené
      platby jsou pro nás trochu problém účetně.{" "}
      <em>
        Pokud jste nám peníze posílali jako dar, pošlete nám je prosím znovu a
        do zprávy pro příjemce napište, že jde o dar, ať máme jasno.
      </em>
    </p>
    <p>
      Alternativně můžete darovat též{" "}
      <a href="/darujme" className="typo-link">
        přes server Darujme
      </a>
      . Tam už je účel platby úplně jasný a navíc od nás koncem účetního roku
      automaticky dostanete potvrzení o daru, abyste si ho mohli odečíst z daní.
    </p>
    <p>
      Kdybyste měli ještě nějaké dotazy, ozvěte se na{" "}
      <a href="mailto:darci@ohlasy.info" className="typo-link">
        darci@ohlasy.info
      </a>
      . A pardon za komplikace!
    </p>
  </main>
);

export default Page;
