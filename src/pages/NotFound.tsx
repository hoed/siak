
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg overflow-hidden border border-border">
        <div className="bg-primary/10 p-6 flex items-center justify-center">
          <AlertCircle className="text-primary h-16 w-16" />
        </div>
        <div className="p-6 text-center">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl font-medium text-card-foreground mb-2">
            Halaman Tidak Ditemukan
          </p>
          <p className="text-muted-foreground mb-6">
            Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          </p>
          <Link to="/">
            <Button className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
