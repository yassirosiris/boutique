import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    await http.post("/auth/register", body);
    toast.success("Compte cree");
    navigate("/login");
  };
  return (
    <form onSubmit={submit} className="grid max-w-sm gap-3 rounded border bg-white p-6">
      <h1 className="text-2xl font-bold">Inscription</h1>
      <input name="name" placeholder="Nom" className="rounded border p-2" />
      <input name="email" type="email" placeholder="Email" className="rounded border p-2" />
      <input name="password" type="password" placeholder="Mot de passe" className="rounded border p-2" />
      <button className="rounded bg-primary py-2 text-white">S'inscrire</button>
    </form>
  );
};
