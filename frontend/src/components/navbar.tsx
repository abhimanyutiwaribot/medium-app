import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(
    localStorage.getItem("token")
  );

  function logout() {
    localStorage.removeItem("token");
    navigate("/signin");
  }

  return (
    <nav className="border-b">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left */}
        <Link to="/" className="text-xl font-semibold">
          Xedium
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <>
              <Link to="/signin" className="text-sm">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="text-sm border px-3 py-1 rounded"
              >
                Sign up
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link
                to="/editor"
                className="text-sm font-medium"
              >
                Write
              </Link>

              <button
                onClick={logout}
                className="text-sm text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
