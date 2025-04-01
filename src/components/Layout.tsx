
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .tracking-dot {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          z-index: 10;
        }
        
        .tracking-line {
          position: absolute;
          width: 1px;
          background-color: #e5e7eb;
          z-index: 5;
        }
        
        .tracking-animation {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}} />
    </div>
  );
};

export default Layout;
