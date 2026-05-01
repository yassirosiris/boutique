import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";

export const LoginPage = () => {
  const navigate = useNavigate();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    const { data } = await http.post("/auth/login", body);
    localStorage.setItem("token", data.token);
    toast.success("Connexion reussie");
    navigate("/");
  };

  return (
    <form onSubmit={submit} className="grid max-w-sm gap-3 rounded border bg-white p-6">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <input name="email" type="email" placeholder="Email" className="rounded border p-2" />
      <input name="password" type="password" placeholder="Mot de passe" className="rounded border p-2" />
      <button className="rounded bg-primary py-2 text-white">Se connecter</button>
    </form>
  );
};
