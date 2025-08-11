import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IIPCData } from "@/lib/supabase";
import {
  MessageCircle,
  Archive,
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import iipcLogo from "@/assets/iipc-logo.svg";
import {useItemTypes, useIIPCData } from "@/hooks/use-iipc-data";

const Index = () => {
  const { itemTypes, loading: itemTypesLoading, error: itemTypesError } = useItemTypes();
  const { data: allMaterials, loading: allMaterialsLoading, error: allMaterialsError } = useIIPCData();

  // State for animated carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedMaterials, setDisplayedMaterials] = useState<IIPCData[]>([]);

  // Carousel animation effect
  useEffect(() => {
    if (!allMaterials || allMaterials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 3) % allMaterials.length;
        return nextIndex;
      });
    }, 8000); // Switch every 8 seconds

    return () => clearInterval(interval);
  }, [allMaterials]);

  // Update displayed materials based on current index with wrap-around
  useEffect(() => {
    if (!allMaterials || allMaterials.length === 0) return;
    const total = allMaterials.length;
    const startIndex = currentIndex;
    const newDisplayed: IIPCData[] = [];
    for (let i = 0; i < 3; i++) {
      newDisplayed.push(allMaterials[(startIndex + i) % total]);
    }
    setDisplayedMaterials(newDisplayed);
  }, [currentIndex, allMaterials]);

  // Handle material click
  const handleMaterialClick = (arkUrl: string) => {
    if (arkUrl) {
      window.open(arkUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-8 animate-in fade-in-0 slide-in-from-bottom-4 gap-6 sm:gap-12">
            <div className="relative flex-shrink-0">
              <img
                src={iipcLogo}
                alt="IIPC Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-research-green/30 rounded-full blur-xl"></div>
            </div>
            <div className="text-left max-w-xl">
              <h1 className="text-3xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-research-green bg-clip-text text-transparent">
                IIPC Assistant
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground font-semibold">
                AI-Powered Web Archiving Research
              </p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed">
            Explore conference materials, research papers, and presentations from the{" "}
            International Internet Preservation Consortium. Get instant answers about web archiving
            practices, technical standards, and digital preservation.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 px-4 sm:px-0">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-research-green text-white border-0 px-8 py-3 text-lg font-semibold"
            >
              <Link to="/chat" className="flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-3" />
                Start Asking Questions
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto border-2 border-primary/30 text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-research-green/10 hover:border-primary transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg font-semibold"
            >
              <Link to="/browse" className="flex items-center justify-center">
                <Archive className="w-5 h-5 mr-3" />
                Browse Materials
              </Link>
            </Button>
          </div>
        </div>

        {/* Available Item Types and Recent Materials */}
        <div className="mb-20 px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Available Item Types */}
            <div className="animate-in fade-in-0 slide-in-from-left-4" style={{ animationDelay: "800ms" }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Available Item Types</h2>
                <Button
                  variant="ghost"
                  asChild
                  className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-research-green/10 transition-colors text-primary"
                >
                  <Link to="/browse" className="flex items-center font-semibold">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {itemTypesLoading ? (
                  // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <Card
                      key={index}
                      className="p-6 border-0 bg-gradient-to-r from-background to-muted/20 rounded-xl"
                    >
                      <div className="h-6 bg-muted animate-pulse rounded mb-3" />
                      <div className="h-8 bg-muted animate-pulse rounded" />
                    </Card>
                  ))
                ) : itemTypesError ? (
                  <div className="col-span-full text-center text-muted-foreground p-8">
                    <div className="text-lg font-medium">Error loading item types</div>
                    <div className="text-sm text-muted-foreground mt-2">{itemTypesError}</div>
                  </div>
                ) : itemTypes.length === 0 ? (
                  <div className="col-span-full text-center text-muted-foreground p-8">
                    <div className="text-lg font-medium">No item types available</div>
                  </div>
                ) : (
                  itemTypes.slice(0, 6).map((itemType, index) => (
                    <Card
                      key={itemType.type}
                      className="p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-0 bg-gradient-to-r from-background to-primary/5 rounded-xl"
                      style={{ animationDelay: `${1000 + index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground capitalize text-lg">{itemType.type}</h3>
                        <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-research-green/20 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2">{itemType.count.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">items available</div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Materials */}
            <div className="animate-in fade-in-0 slide-in-from-right-4" style={{ animationDelay: "900ms" }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Recent Materials</h2>
                <Button
                  variant="ghost"
                  asChild
                  className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-research-green/10 transition-colors text-primary"
                >
                  <Link to="/browse" className="flex items-center font-semibold">
                    Browse All <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 relative">
                {allMaterialsLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-4 bg-muted animate-pulse rounded mb-3 w-3/4" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                    </Card>
                  ))
                ) : allMaterialsError ? (
                  <div className="text-center text-muted-foreground">Error loading materials: {allMaterialsError}</div>
                ) : displayedMaterials.length === 0 ? (
                  <div className="text-center text-muted-foreground">No materials available</div>
                ) : (
                  <div className="space-y-4">
                    {displayedMaterials.map((material, index) => (
                      <Card
                        key={`${material.id}-${currentIndex}`}
                        className="p-4 sm:p-6 hover:shadow-lg transition-all duration-500 cursor-pointer transform hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4 border-0 bg-gradient-to-r from-background to-primary/5 rounded-xl"
                        style={{
                          animationDelay: `${index * 200}ms`,
                          animationDuration: "700ms",
                        }}
                        onClick={() => handleMaterialClick(material.ark_url)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleMaterialClick(material.ark_url);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <Badge
                            variant="outline"
                            className="capitalize border-primary/30 text-primary bg-gradient-to-r from-primary/10 to-research-green/10 px-3 py-1 text-sm font-semibold rounded-full"
                          >
                            {material.item_type || "document"}
                          </Badge>
                          <span className="text-sm text-muted-foreground font-medium">
                            {material.date ? new Date(material.date).getFullYear() : "N/A"}
                          </span>
                        </div>

                        <h3 className="font-bold text-foreground mb-3 line-clamp-2 text-base sm:text-lg">
                          {material.title || "Untitled"}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-4 font-medium">
                          by {material.creator || "Unknown Author"}
                        </p>

                        <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {material.description || "No description available"}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card
          className="p-8 sm:p-12 text-center bg-gradient-to-r from-primary/10 to-research-green/10 border-primary/30 animate-in fade-in-0 slide-in-from-bottom-4 rounded-2xl max-w-4xl mx-auto"
          style={{ animationDelay: "1200ms" }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-primary/20 to-research-green/20 flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
            Ready to Explore IIPC Assistant?
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto">
            Whether you're researching web archiving methodologies, looking for technical
            solutions, or exploring policy frameworks, our AI assistant can help you find
            relevant materials from years of IIPC conferences and research.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-research-green text-white border-0 px-10 py-4 text-lg font-semibold"
            >
              <Link to="/chat" className="flex items-center justify-center">
                <Search className="w-6 h-6 mr-3" />
                Ask Your First Question
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-research-green text-white border-0 px-10 py-4 text-lg font-semibold"
            >
              <a
                href="https://netpreserve.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <ExternalLink className="w-6 h-6 mr-3" />
                Visit IIPC Site
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;