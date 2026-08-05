import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollProgress from '../../components/layout/ScrollProgress';
import HeroSection from '../../components/sections/HeroSection';
import PostsSection from '../../components/sections/PostsSection';
import SobreSection from '../../components/sections/SobreSection';
import EquipeSection from '../../components/sections/EquipeSection';
import AtividadesSection from '../../components/sections/AtividadesSection';
import EstruturaSection from '../../components/sections/EstruturaSection';
import SecoesDinamicasSection from '../../components/sections/SecoesDinamicasSection';
import LocalizacaoSection from '../../components/sections/LocalizacaoSection';
import { useSecoes } from '../../hooks/useSecoes';

export default function HomePage() {
  const { secoes } = useSecoes();

  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <PostsSection />
        <SobreSection />
        <EquipeSection />
        <AtividadesSection />
        <EstruturaSection />
        <SecoesDinamicasSection />
        <LocalizacaoSection number={5 + secoes.length} />
      </main>
      <Footer />
    </div>
  );
}
