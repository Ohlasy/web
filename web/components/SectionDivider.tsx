export const SectionDivider = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 mt-10 text-center">
    <h2 className="inline-block uppercase px-3 bg-white">{children}</h2>
    <div className="border-t border-silver -mt-[14px] h-4"></div>
  </div>
);
