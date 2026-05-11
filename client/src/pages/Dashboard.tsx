import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Zap, Users, Wrench } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const tiles = [
    {
      title: "Courses",
      description: "Commandez vos produits",
      icon: ShoppingCart,
      href: "/orders",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Gaz",
      description: "Commander du gaz",
      icon: Zap,
      href: "/gas",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Artisans",
      description: "Trouver un artisan",
      icon: Wrench,
      href: "/artisans",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Livreurs",
      description: "Suivre votre livraison",
      icon: Users,
      href: "/deliveries",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Bienvenue, {user?.full_name}!</h1>
          <p className="text-muted-foreground mt-2">
            Accédez aux services disponibles dans votre cité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Card
                key={tile.href}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-lg ${tile.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{tile.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {tile.description}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
            <p className="text-muted-foreground">
              Aucune activité pour le moment
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Cotisations</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant dû</span>
                <span className="font-semibold">5 000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dernier paiement</span>
                <span className="text-sm">-</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
