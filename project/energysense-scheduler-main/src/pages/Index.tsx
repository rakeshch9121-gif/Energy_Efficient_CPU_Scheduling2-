import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, TrendingDown, Cpu, ArrowRight } from "lucide-react";
import energyShowcase from "@/assets/energy-showcase.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-dark via-background to-tech-blue/20 relative overflow-hidden">
      {/* Animated circuit background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-secondary/20 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/40">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">EnergyScheduler</span>
          </div>
          <Link to="/simulation">
            <Button variant="outline" className="border-primary/40 hover:bg-primary/10 hover:border-primary">
              Launch Simulation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-6">
          <div className="inline-block">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Advanced CPU Scheduling</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-primary">CPU SCHEDULER</span>
            <br />
            <span className="text-foreground">SHOWDOWN</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              ENERGY EFFICIENCY
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            DVFS Algorithm Halves Energy Use
          </p>
        </div>

        {/* Energy Showcase Image */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500" />
            <Card className="relative overflow-hidden border-primary/20 bg-card/80 backdrop-blur-xl">
              <img 
                src={energyShowcase} 
                alt="CPU Scheduler Energy Efficiency Comparison" 
                className="w-full h-auto"
              />
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-destructive mb-1">50.00%</h3>
                <p className="text-sm text-muted-foreground">Energy Savings</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-1">DVFS</h3>
                <p className="text-sm text-muted-foreground">Dynamic Voltage Scaling</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-lg hover:shadow-secondary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Cpu className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-secondary mb-1">FCFS</h3>
                <p className="text-sm text-muted-foreground">Optimized Algorithm</p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            See It In Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience real-time CPU scheduling simulation with interactive visualization of energy consumption and performance metrics.
          </p>
          <Link to="/simulation">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              <Zap className="mr-2 w-5 h-5" />
              Start Interactive Simulation
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 mt-16 border-t border-border/50">
        <p className="text-center text-sm text-muted-foreground">
          Energy-Efficient CPU Scheduling Research Project
        </p>
      </footer>
    </div>
  );
};

export default Index;
