import Link from "next/link";

const destinations = [
  {
    number: "01 / FOR THE HUNGRY",
    icon: "01",
    title: "Browse the menu",
    description: "Find your canteen favourites and build an order at your own pace.",
    action: "Explore today’s menu",
    href: "/menu",
  },
  {
    number: "02 / FOR THE KITCHEN",
    icon: "02",
    title: "Vendor dashboard",
    description: "Keep incoming orders moving from the kitchen to the pickup counter.",
    action: "Manage orders",
    href: "/vendor",
  },
  {
    number: "03 / AT A GLANCE",
    icon: "03",
    title: "Live queue board",
    description: "Check the latest tokens and see what is ready to collect.",
    action: "See the queue",
    href: "/queue",
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-content">
          <span className="eyebrow">A little less queue, a lot more lunch</span>
          <h1 className="hero-title">Your break.<br />Your <em>favourite bite.</em></h1>
          <p className="hero-copy">
            Good food deserves a better queue. Order ahead, pick a time, and collect
            something delicious when it suits you.
          </p>
          <div className="hero-actions">
            <Link className="hero-button" href="/menu">Find your lunch <span aria-hidden="true">→</span></Link>
            <Link className="hero-secondary" href="/orders">Track an order <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-note" aria-label="How it works">
            <span><b>01</b> Pick your favourites</span>
            <span><b>02</b> Choose a pickup time</span>
            <span><b>03</b> Skip the line</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="start-heading">
        <div className="section-heading">
          <div>
            <h2 id="start-heading">A smoother lunch starts here</h2>
            <p>Everything you need, all in one place.</p>
          </div>
        </div>
        <div className="home-cards mt-5">
          {destinations.map((item) => (
            <Link className="home-card" href={item.href} key={item.href}>
              <span className="card-icon" aria-hidden="true">{item.icon}</span>
              <span className="card-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="card-arrow">{item.action} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <aside className="demo-note">
        <strong>Trying the demo?</strong>
        <span>Student</span><code>student@demo.com / student123</code>
        <span>Vendor</span><code>vendor@demo.com / vendor123</code>
      </aside>
    </div>
  );
}
