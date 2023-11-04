// const rows = [
//   {
//     id: 1,
//     name: randomTraderName(),
//     age: 25,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: 2,
//     name: randomTraderName(),
//     age: 36,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: 3,
//     name: randomTraderName(),
//     age: 19,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: 4,
//     name: randomTraderName(),
//     age: 28,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: 5,
//     name: randomTraderName(),
//     age: 23,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
// ];

/* async local storage data set and get example 

const [veggie, setVeggie] = useState();
  useEffect(() => {
    getVeggie();
  }, []);

 const getVeggie = async () => {
    const check = localStorage.getItem("veggie");
    if (check) {
      setVeggie(JSON.parse(check));
    } else {
      const res = await fetch(apiUrl);
      const data = await res.json();
      localStorage.setItem("veggie", JSON.stringify(data.recipes));
      setVeggie(data.recipes);
      console.log("app-data", data.recipes);
    }
  };


*/

// const data = [
//   {
//     id: 1,
//     title: traderName,
//     price: 25,
//     quantity: randomQuantity(),
//     saleDate: randomCreatedDate(), //moment(randomCreatedDate(), "YYYY-MM-DD"),
//     gift: randomAddress(),
//     avatar: shortcut,
//     status: "🟡 Üretime gönderildi",
//     createdDate: new Date(),
//   },
// ];

// const [rows, setRows] = React.useState(newData);
// const [rows, setRows] = React.useState(() => getItems);

// const handleAddRow = () => {
//   setRows((data) => [...data, createRandomRow()]);
// };

// blob to img component
// <img className="blob-to-image" src={"data:image/png;base64," + photoBlob}></img>
