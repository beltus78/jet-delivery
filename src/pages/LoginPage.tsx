import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LockKeyhole, 
  Mail, 
  LogIn, 
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthService } from "@/services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate inputs
      if (!email || !password) {
        toast.error("Please enter your email and password");
        return;
      }

      // Attempt to sign in
      const { user, session } = await AuthService.signIn(email, password);
      
      if (user && session) {
        toast.success("Login successful!");
        
        // Get user profile to determine role
        const userProfile = await AuthService.getCurrentUser();
        
        // Redirect based on role
        if (userProfile?.role === 'admin' || userProfile?.role === 'manager') {
          navigate("/admin/dashboard");
        } else {
          navigate("/admin/dashboard"); // Default to admin dashboard for now
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      await AuthService.resetPassword(email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="p-3 rounded-full bg-swift-100">
            <Truck className="h-8 w-8 text-swift-700" />
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-600 mt-1">
              Log in to your Jet Delivery account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-swift-600 hover:text-swift-800"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full gap-2 bg-swift-700 hover:bg-swift-800" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Demo credentials: admin@jetdelivery.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
