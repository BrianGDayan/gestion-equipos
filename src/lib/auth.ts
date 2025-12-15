export interface LoginDto {
  idUsuario: number;
  clave: string;
}

export interface AuthResponse {
  id_usuario: number;
  rol: string;
  access_token: string;
}

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error("Error de autenticación");
  }

  const data: AuthResponse = await res.json();
  
  // Guardamos en LocalStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify({ id: data.id_usuario, rol: data.rol }));
  }

  return data;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};