const API_URL = import.meta.env.VITE_API_URL as string;

export async function apifetch(
  path: string,
  options: RequestInit = {}
){
  const token = localStorage.getItem("token");

  const headers : HeadersInit = {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`
    }),
    ...options.headers,
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if(!res.ok){
    const err = await res.json().catch(() => ({}));
    throw err;
  }

  return res.json();

}