import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Search, 
  ExternalLink, 
  Calendar, 
  User, 
  FileText,
  Video,
  Mic,
  Users,
  SortAsc,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  title: string;
  author?: string;
  year?: number;
  type: 'presentation' | 'paper' | 'transcript' | 'discussion';
  url?: string;
  excerpt?: string;
  conference?: string;
  tags?: string[];
}

interface CitationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sources: Source[];
}

const typeIcons = {
  presentation: Video,
  paper: FileText,
  transcript: Mic,
  discussion: Users,
};

const typeColors = {
  presentation: "bg-primary/10 text-primary border-primary/20",
  paper: "bg-accent/10 text-accent border-accent/20",
  transcript: "bg-research-green/10 text-research-green border-research-green/20",
  discussion: "bg-muted/10 text-muted-foreground border-muted/20",
};

export function CitationsPanel({ isOpen, onClose, sources }: CitationsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"relevance" | "year" | "title">("relevance");

  const filteredSources = sources
    .filter(source => {
      if (filterType !== "all" && source.type !== filterType) return false;
      if (searchTerm) {
        return source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               source.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               source.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "year":
          return (b.year || 0) - (a.year || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0; // Keep original order for relevance
      }
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-background border-l border-border shadow-2xl font-sans">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-background font-sans">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="font-bold text-xl text-primary font-sans">Citations & Sources</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 text-primary hover:bg-primary/10 font-sans rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg rounded-xl"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex h-12 rounded-xl border border-border bg-background px-4 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary font-sans"
              >
                <option value="all">All Types</option>
                <option value="paper">Papers</option>
                <option value="presentation">Presentations</option>
                <option value="transcript">Transcripts</option>
                <option value="discussion">Discussions</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex h-12 rounded-xl border border-border bg-background px-4 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary font-sans"
              >
                <option value="relevance">Relevance</option>
                <option value="year">Year</option>
                <option value="title">Title</option>
              </select>
            </div>

            <div className="text-base text-muted-foreground font-medium">
              {filteredSources.length} of {sources.length} sources
            </div>
          </div>
        </div>

        {/* Sources List */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {filteredSources.map((source, index) => {
              const TypeIcon = typeIcons[source.type];
              
              return (
                <Card key={index} className="p-6 hover:shadow-xl transition-shadow rounded-xl">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-xl border",
                        typeColors[source.type]
                      )}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg leading-tight mb-2">
                          {source.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          {source.author && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{source.author}</span>
                            </div>
                          )}
                          
                          {source.year && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">{source.year}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <Badge 
                      variant="outline" 
                      className={cn("text-sm capitalize font-sans border-primary text-primary px-3 py-1 rounded-full", typeColors[source.type])}
                    >
                      {source.type}
                    </Badge>

                    {/* Excerpt */}
                    {source.excerpt && (
                      <div className="bg-muted/30 p-4 rounded-xl">
                        <p className="text-base text-muted-foreground italic leading-relaxed">
                          "{source.excerpt}"
                        </p>
                      </div>
                    )}

                    {/* Conference Info */}
                    {source.conference && (
                      <div className="text-sm text-muted-foreground font-medium">
                        From: {source.conference}
                      </div>
                    )}

                    {/* Tags */}
                    {source.tags && source.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {source.tags.map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="secondary" 
                            className="text-sm bg-primary/20 text-primary font-medium px-3 py-1 rounded-full"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-3">
                      {source.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 font-sans border-primary text-primary hover:bg-primary/10 rounded-lg"
                          asChild
                        >
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Source
                          </a>
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-4 font-sans text-primary hover:bg-primary/10 rounded-lg"
                      >
                        Cite
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {filteredSources.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No sources match your criteria</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}