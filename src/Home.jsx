import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Zap, ExternalLink, Sparkles } from "lucide-react";

import earthIcon from '@/public/earth.svg';
import cn from "@/utils/cn";
import { routes, formatToolName } from "@/routes";
import ExternalLinkA from "@/common/ExternalLink";

const HomePage = () => (
  <>
    <HeroSection />
    <div id="tools">
      <ToolsGrid />
    </div>
  </>
);

const HeroSection = () => {
  const [stars, setStars] = useState("30+");

  useEffect(() => {
    const getStarsCount = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/repos/sabeerbikba/dev.tools"
        );
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

        const data = await res.json();
        const rawCount = data?.stargazers_count;

        const formatNumber = (num) =>
          new Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(num);

        if (rawCount > 1000) {
          setStars(formatNumber(rawCount) + "+");
        } else {
          setStars(formatNumber(rawCount));
        }
      } catch (err) {
        console.error("Failed to fetch stars:", err);
      }
    };

    getStarsCount();
  }, []);

  return (
    <section className="relative !py-24 !px-4 text-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl !mx-auto">
        <div className="flex justify-center !mb-8">
          <div className="relative !py-4 !m-auto bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-3xl border border-[#4446a6]/20 aspect-square w-32">
          {/* src="/earth.svg" */}
            <img
            src={earthIcon}
              alt="dev.tools logo"
              className="relative top-[5%] left-[28%]"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>

        <h1 className="!mb-6 bg bg-clip-text text-white text-3xl max-md:text-2xl">
          Dev.tools
        </h1>

        <p className="!mb-8 text-white max-w-2xl !mx-auto text-lg">
          Open-source developer toolkit — trusted by devs worldwide.
        </p>

        <p className="!mb-8 text-white max-w-2xl !mx-auto text-lg">
          A growing collection of 20+ free, fast, and focused tools to speed up
          your workflow. Loved by developers, powered by the community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center !mb-8">
          <a
            href="/#tools"
            className="bg-[#4446a6] text-2xl text-white/95 inline-flex-center whitespace-nowrap text-sm font-medium transition-all h-10 rounded-md !px-6 gap-2"
          >
            <Zap className="w-5 h-5" />
            Explore Tools
          </a>
          <ExternalLinkA
            href="https://github.com/sabeerbikba/dev.tools"
            className="text-white hover:bg-[#4446a6]/25 border border-[#4446a6]/60 inline-flex-center whitespace-nowrap text-sm font-medium transition-all h-10 rounded-md !px-2 gap-2"
            style={{
              backgroundImage:
                "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill-opacity=%220.35%22 viewBox=%220 0 100 100%22><text x=%220%22 y=%2216%22 font-size=%2216%22>⭐</text></svg>')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "220px",
            }}
          >
            Star us on GitHub ({stars})
          </ExternalLinkA>
        </div>
      </div>
    </section>
  );
};

const ToolsGrid = () => (
  <section id="tools" className="!py-16 !px-4 relative">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
    </div>

    <div className="max-w-7xl !mx-auto text-white">
      <div className="text-center !mb-12">
        <h2 className="!mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent !text-white text-4xl max-md:text-3xl">
          Dev.tools Collection
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {routes
          .slice(1, -1)
          .map(({ name, description, path, category, icon, isPopular }, i) => (
            <ToolCard
              key={i}
              name={formatToolName(path).titleCase}
              description={description}
              path={"/" + path}
              category={category}
              icon={icon}
              isPopular={isPopular}
            />
          ))}
      </div>

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  </section>
);

const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "text-white min-h-64 flex flex-col gap-6 rounded-xl border border-gray-500 hover:border-gray-600 bg-[#374151]/20 hover:bg-[#374151]/30",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "@container/card-header font-semibold grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 !px-6 !pt-6",
      className
    )}
    {...props}
  />
);

const CardTitle = ({ className, ...props }) => (
  <h4 className={cn("leading-none", className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div
    className={cn(
      "!px-6 h-[calc(100%-82px)] [&:last-child]:!pb-6 flex flex-col justify-between",
      className
    )}
    {...props}
  />
);

const ToolCard = ({ name, description, path, category, icon, isPopular }) => (
  <Card className="group max-w-[410px] hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
    {isPopular && (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
    )}

    <CardHeader className="!pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="!p-2.5 bg-[#4446a6]/10 rounded-xl text-[#4446a6] group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
          <div>
            <CardTitle className="group-hover:text-[#e6e6e6] transition-colors">
              {name}
            </CardTitle>
            {isPopular && (
              <div className="flex items-center gap-1 !mt-1">
                <Sparkles className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-medium text-yellow-600">
                  Popular
                </span>
              </div>
            )}
          </div>
        </div>
        <span className="text-xs border border-[#4446a6]/30 bg-[#4446a6]/20 text-white/90 inline-flex-center rounded-md !px-2 !py-0.5 font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow]">
          {category}
        </span>
      </div>
    </CardHeader>

    <CardContent>
      <p className="text-muted-foreground !mb-4 leading-relaxed">
        {description}
      </p>
      <NavLink
        className="inline-flex-center group-hover:bg-[#4446a6] whitespace-nowrap text-sm font-medium border h-8 rounded-md !px-3 w-full gap-2 group-hover:bg-primary group-hover:text-[#4446a6]-foreground border-gray-200 group-hover:border-gray-300 transition-all duration-200"
        to={path}
      >
        Open Tool
        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </NavLink>
    </CardContent>
  </Card>
);

export default HomePage;
