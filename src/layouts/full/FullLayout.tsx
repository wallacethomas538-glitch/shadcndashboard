import { FC } from 'react';
import Sidebar from './vertical/sidebar/Sidebar';
import Header from './vertical/header/Header';
import { SidebarInset, SidebarProvider } from 'src/components/ui/sidebar';
import { cn } from 'src/lib/utils';
import Footer from './shared/footer/Footer';
import { Outlet } from 'react-router';

const FullLayout: FC = () => {

  return (
    <SidebarProvider
           defaultOpen={true}
      style={{ "--sidebar-width-icon": "52px" } as React.CSSProperties}
    >
      
        <Sidebar />
     
      <SidebarInset className="outline outline-border m-2 rounded-none! overflow-hidden">
        {/* Top Header  */}
       <Header /> 
        
          {/* VektorFlow page navigation — always visible on desktop and mobile. */}
        <nav aria-label="VektorFlow pages" className="border-b border-border bg-background px-4 py-2">
          <div className="flex gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
            {vektorFlowPages.map(([label, path]) => (
              <Link
                key={path}
                to={path}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Body Content  */}
          <div className="flex flex-1 flex-col gap-4 p-4">
          <div className={cn("w-full mx-auto", "container")}>
            <div className=" min-h-[calc(100vh-140px)]"><Outlet /></div>
            <div className="pt-6">
              <Footer />
            </div>
          </div>
        </div>
       
        
      </SidebarInset>
    </SidebarProvider>
  );
};

export default FullLayout;
