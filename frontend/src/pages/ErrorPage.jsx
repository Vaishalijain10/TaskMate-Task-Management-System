import { Link } from "react-router-dom";

const ErrorPage = () => {
  const token = localStorage.getItem("token");
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-lg mt-2">
        Oops! The page you are looking for does not exist.
      </p>

      {/* Conditional rendering based on token */}
      {token ? (
        // If user is logged in, show "Go Home"
        <Link
          to="/home"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Home
        </Link>
      ) : (
        // If user is not logged in, show "Back to login"
        <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Back to login
        </Link>
      )}
    </div>
  );
};

export default ErrorPage;
