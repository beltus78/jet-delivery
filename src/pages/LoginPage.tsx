import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LockKeyhole, 
  Mail, 
  LogIn, 
  Truck,
  UserPlus,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthService } from "@/services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignup) {
        // Handle signup
        if (!email || !password || !firstName || !lastName) {
          toast.error("Please fill in all fields");
          return;
        }

        const { user, session } = await AuthService.signUp(email, password, { first_name: firstName, last_name: lastName });
        
        if (user && session) {
          toast.success("Account created successfully! You can now log in.");
          setIsSignup(false);
          setFirstName("");
          setLastName("");
        }
      } else {
        // Handle login
        if (!email || !password) {
          toast.error("Please enter your email and password");
          return;
        }

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
      }
    } catch (error: any) {
      console.error('Login/Signup error:', error);
      toast.error(error.message || "Operation failed. Please try again.");
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

  const createDemoAccount = async (demoEmail: string, demoPassword: string, demoFirstName: string, demoLastName: string) => {
    setLoading(true);
    try {
      const { user, session } = await AuthService.signUp(demoEmail, demoPassword, { 
        first_name: demoFirstName, 
        last_name: demoLastName 
      });
      
      if (user && session) {
        toast.success(`Demo account created: ${demoEmail}`);
        setEmail(demoEmail);
        setPassword(demoPassword);
        setIsSignup(false);
      }
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        toast.info(`Account ${demoEmail} already exists. You can log in with it.`);
        setEmail(demoEmail);
        setPassword(demoPassword);
        setIsSignup(false);
      } else {
        toast.error(error.message || "Failed to create demo account");
      }
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isSignup 
                ? "Sign up for your Jet Delivery account"
                : "Log in to your Jet Delivery account"
              }
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                      required={isSignup}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10"
                      required={isSignup}
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}
            
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
                {!isSignup && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-swift-600 hover:text-swift-800"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                )}
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
                    <span>{isSignup ? "Creating account..." : "Logging in..."}</span>
                  </>
                ) : (
                  <>
                    {isSignup ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                    <span>{isSignup ? "Create Account" : "Login"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-swift-600 hover:text-swift-800"
              disabled={loading}
            >
              {isSignup 
                ? "Already have an account? Log in" 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Demo Account Creation:</h3>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => createDemoAccount("admin@jetdelivery.com", "admin123", "Admin", "User")}
                disabled={loading}
              >
                Create Admin Account
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => createDemoAccount("manager@jetdelivery.com", "manager123", "Manager", "User")}
                disabled={loading}
              >
                Create Manager Account
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => createDemoAccount("operator@jetdelivery.com", "operator123", "Operator", "User")}
                disabled={loading}
              >
                Create Operator Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
