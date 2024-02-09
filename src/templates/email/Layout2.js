export const Layout2 = ({ data }) => ({
  subject: `Order no. ${data.id} received`,
  body: (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h1
        style={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1.25,
          margin: 0,
          marginTop: 30,
        }}
      >
        Your order no. {data.avatar} has been received!
      </h1>
      <h2
        style={{
          textAlign: 'center',
          color: '#555',
          fontSize: 20,
          fontWeight: 600,
          margin: 0,
        }}
      >
        We will make sure that it arrives fast and save.
      </h2>
      <h3
        style={{
          textAlign: 'center',
          color: '#777',
          fontSize: 16,
          fontWeight: 600,
          margin: 5,
        }}
      >
        There are some details:
      </h3>
      <div>
        {/* {Object.keys(variants).map((key) => {
          const product = products.data.find((p) => p.attributes.slug === key.slice(0, -3));

          if (!product) return null;

          return (
            <Product key={key} product={product} quantity={variants[key]} size={key.slice(-2)} />
          );
        })} */}
      </div>
      <h3
        style={{
          textAlign: 'center',
          color: '#000',
          fontSize: 20,
          fontWeight: 600,
          margin: 0,
          marginTop: 10,
        }}
      >
        Total value: €{data.price}
      </h3>
      <p>
        Shop by{' '}
        <a
          href="https://github.com/kriziu"
          target="_blank"
          rel="noreferrer"
          style={{
            fontWeight: 'bolder',
            textDecoration: 'none',
            color: 'black',
          }}
        >
          Bruno Dzięcielski
        </a>
        , all product images from{' '}
        <a
          href="https://nike.com"
          target="_blank"
          rel="noreferrer"
          style={{
            fontWeight: 'bolder',
            textDecoration: 'none',
            color: 'black',
          }}
        >
          nike.com
        </a>
      </p>

      <h5>Hope you enjoy our services!</h5>
    </div>
  ),
});
