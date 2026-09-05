import { CalendarCheck, ChevronRight, MapPin, Phone, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import BarberPlaceholder from "../components/common/BarberPlaceholder";
import SectionHeading from "../components/common/SectionHeading";
import ServiceIcon from "../components/common/ServiceIcon";
import Footer from "../components/layout/Footer";
import PublicNavbar from "../components/layout/PublicNavbar";
import heroImage from "../assets/barber-club-hero.png";
import { cutPhotos } from "../lib/gallery";
import { money } from "../lib/format";
import { readDb } from "../lib/store";

export default function Landing() {
  const db = readDb();
  return (
    <div className="page">
      <PublicNavbar />
      <main>
        <section className="template-hero">
          <img className="hero-bg" src={heroImage} alt="" />
          <div className="container hero-stage">
            <div className="hero-copy hero-reveal">
              <div className="brand-kicker">AREIA BRANCA · SANTOS-SP</div>
              <div className="blackletter">Mt Barbearia</div>
              <h1>Santos' best barber.</h1>
              <p>Cortes precisos, barba impecável e uma experiência premium feita para o seu estilo não depender da ocasião.</p>
              <div className="hero-actions hero-reveal-delay-2">
                <Link className="btn primary" to="/cadastro">Book today <ChevronRight size={18} /></Link>
                <a className="btn ghost" href="#servicos">Ver serviços</a>
              </div>
              <div className="hero-facts hero-reveal-delay-3">
                <span><Star size={15} /> 5,0 Google</span>
                <span><Users size={15} /> +1.500 clientes</span>
                <span><CalendarCheck size={15} /> desde 2020</span>
              </div>
            </div>
            <div className="device-collage hero-reveal-delay-1" aria-label="Prévia visual premium da Mt Barbearia em dispositivos">
              <div className="phone-frame">
                <div className="phone-notch" />
                <img src={heroImage} alt="Preview mobile da Mt Barbearia" />
                <div className="phone-overlay">
                  <strong>MT</strong>
                  <span>BARBEARIA</span>
                </div>
              </div>
              <div className="browser-frame">
                <div className="browser-nav"><span /> <span /> <span /></div>
                <img src={heroImage} alt="Preview desktop da Mt Barbearia" />
                <div className="browser-title">ATLANTA'S BEST BARBER.</div>
              </div>
              <div className="portrait-card portrait-one"><img src={heroImage} alt="Corte masculino em destaque" /></div>
              <div className="portrait-card portrait-two"><img src={heroImage} alt="Acabamento de barba em destaque" /></div>
            </div>
          </div>
          <div className="hero-contact">
            <span><MapPin size={14} /> Av. Eng. Manoel Ferramenta Júnior, 10</span>
            <a href="tel:+5513988592508"><Phone size={14} /> (13) 98859-2508</a>
          </div>
        </section>
        <section className="section" id="servicos">
          <div className="container">
            <SectionHeading eyebrow="Serviços" title="Escolha seu estilo" text="Serviços pensados para cuidar da sua aparência do jeito que você merece." />
            <div className="service-strip">
              {["Coloração", "Alisamento", "Barba com navalha", "Toalha quente", "Cabelos cacheados", "Corte militar", "Cortes infantis", "Shampoo e condicionador"].map((item) => <span className="badge" key={item}>{item}</span>)}
            </div>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {db.services.filter((service) => service.active).map((service) => (
                <article className="card card-pad lift-card reveal-on-load" style={{ animationDelay: `${service.sortOrder * 70}ms` }} key={service.id}>
                  <ServiceIcon iconKey={service.iconKey} />
                  <h3>{service.name}</h3>
                  <p className="muted">{service.description}</p>
                  <strong style={{ color: "var(--gold-2)" }}>{money.format(service.price)}</strong>
                  <span className="muted"> · {service.durationMinutes} min</span>
                  <div style={{ marginTop: 16 }}><Link className="btn primary" to={`/app/agendamento/novo?service=${service.id}`}>Agendar</Link></div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section" id="barbeiros" style={{ background: "#0d0d0d" }}>
          <div className="container">
            <SectionHeading eyebrow="Profissionais" title="Conheça nossos barbeiros" />
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))" }}>
              {db.barbers.filter((barber) => barber.active).map((barber) => (
                <article className="card card-pad lift-card reveal-on-load" style={{ animationDelay: `${barber.appointmentsCount / 20}ms` }} key={barber.id}>
                  <BarberPlaceholder name={barber.name} size={76} />
                  <h3>{barber.name}</h3>
                  <p className="muted">{barber.bio}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{barber.specialties.map((item) => <span className="badge" key={item}>{item}</span>)}</div>
                  <p><Star size={16} fill="var(--gold-2)" color="var(--gold-2)" /> {barber.rating} · {barber.appointmentsCount} atendimentos</p>
                  <Link className="btn primary" to={`/app/agendamento/novo?barber=${barber.id}`}>Agendar com {barber.name.split(" ")[0]}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section" id="cortes">
          <div className="container">
            <SectionHeading eyebrow="Cortes reais" title="Modelos que já passaram pela cadeira" text="Referências de acabamento para você escolher o próximo estilo antes de agendar." />
            <div className="cuts-grid">
              {cutPhotos.map((photo, index) => (
                <article className={`cut-card cut-card-${index + 1}`} key={photo.title}>
                  <img src={photo.src} alt={photo.title} />
                  <div>
                    <strong>{photo.title}</strong>
                    <span>{photo.description}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Como funciona" title="Seu horário em três passos" />
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {["Escolha serviço e profissional", "Veja horários disponíveis", "Confirme e receba o resumo"].map((step, index) => <div className="card card-pad lift-card reveal-on-load" style={{ animationDelay: `${index * 110}ms` }} key={step}><div className="eyebrow">0{index + 1}</div><h3>{step}</h3></div>)}
            </div>
          </div>
        </section>
        <section className="section" id="avaliacoes" style={{ background: "#0d0d0d" }}>
          <div className="container">
            <SectionHeading eyebrow="Avaliações" title="O acabamento fala, os clientes confirmam" />
            <div className="reviews-track">
              {[...db.reviews, ...db.reviews].map((review, index) => <article className="card card-pad review-card" key={`${review.id}-${index}`}><p>{review.comment}</p><strong>{review.authorName}</strong><div style={{ color: "var(--gold-2)" }}>★ {review.rating}</div></article>)}
            </div>
          </div>
        </section>
        <section className="section" id="sobre">
          <div className="container split">
            <div>
              <SectionHeading eyebrow="Sobre a barbearia" title="Mais que um corte, uma experiência." text="A Mt Barbearia nasceu com o objetivo de transformar o momento do corte em uma experiência completa. Ambiente confortável, profissionais especializados e atendimento de alto nível na Areia Branca, em Santos." />
              <Link className="btn primary" to="/login">Entrar na área do cliente</Link>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="card card-pad"><strong className="font-display" style={{ fontSize: "2.1rem" }}>6</strong><p className="muted">serviços</p></div>
              <div className="card card-pad"><strong className="font-display" style={{ fontSize: "2.1rem" }}>+3.000</strong><p className="muted">cortes realizados</p></div>
              <div className="card card-pad"><strong className="font-display" style={{ fontSize: "2.1rem" }}>5,0</strong><p className="muted">avaliação no Google</p></div>
              <div className="card card-pad"><strong className="font-display" style={{ fontSize: "2.1rem" }}>4</strong><p className="muted">barbeiros profissionais</p></div>
            </div>
          </div>
        </section>
        <section className="section" id="contato" style={{ background: "#0d0d0d" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <h2 className="font-display" style={{ fontSize: "clamp(2.3rem, 5vw, 4.5rem)", margin: "0 0 12px" }}>Pronto para renovar o visual?</h2>
            <p className="muted" style={{ fontSize: "1.1rem" }}>Escolha seu horário e deixe o resto com a gente.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
              <Link className="btn primary" style={{ padding: "15px 24px" }} to="/cadastro">Agendar agora</Link>
              <a className="btn" href="tel:+5513988592508">Ligar</a>
              <a className="btn ghost" href="https://www.instagram.com/mtbarbearia__/" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
