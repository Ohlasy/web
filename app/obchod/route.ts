export const GET = () =>
  new Response(null, {
    status: 302,
    headers: {
      Location: "/obchod/pribehy/",
    },
  });
