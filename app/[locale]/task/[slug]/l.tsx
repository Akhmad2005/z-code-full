import LayoutHeader from "../../../components/layouts/header";
export default function NewPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main_layout">
      <LayoutHeader></LayoutHeader>
      {children}
    </div>
  );
}