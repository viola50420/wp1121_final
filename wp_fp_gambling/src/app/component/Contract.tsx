import Link from "next/link";
type ContractProps = {
  contractId: string;
  title: string;
  description: string;
  totalDollar: number;
  attendees: number;
  blockDate: string;
  optionA: string;
  optionB: string;
  optionC: string;
  option: string | null;
  dollar: number | null;
};

export default function Contract({
  contractId,
  title,
  description,
  totalDollar,
  attendees,
  blockDate,
  optionA,
  optionB,
  optionC,
  option,
  dollar,
}: ContractProps) {
  console.log(optionA, optionB, optionC, option);
  if (option) {
    if (option === "optionA") {
      option = optionA;
    } else if (option === "optionB") {
      option = optionB;
    } else if (option === "optionC") {
      option = optionC;
    }
  }
  

  return (
    <>
      <Link href={`/contract/${contractId}`}>
      <div id={contractId} key={contractId} className="flex flex-col gap-4">
        <div className="card text-center h-100" key={contractId}>
          {/* <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt="Card"
                  height={300}
                /> */}
          <div className="card-body">
            <p className="text-2xl bold mb-2 font-bold">{title}</p>
       
            <p className="card-text">{description}</p>
          </div>
          <hr className="border-t border-gray-600 my-1" />
          <div className="flex gap-4 justify-between my-3">
            {option ? (
              <div className="ml-4 border-t border-2 border-green-600 rounded-md p-2 bg-green-200">
                您已投注「 {option} 」$ {dollar}
              </div>
            ) : (
              <div className="ml-4 border-t border-2 border-gray-600 rounded-md p-2 bg-gray-200">
                您尚未投注
              </div>
            )}
            <div className="flex gap-3 mr-4 py-2">
              <div>參加人數: {attendees}</div>
              <div>總投注金額 $ {totalDollar}</div>
              <div>截止時間: {blockDate}</div>
            </div>
          </div>
          {/* <div className="card-body">
                  <Link to={"/product/" + product.id} className="btn btn-dark m-1">
                    Buy Now
                  </Link>
                  <button className="btn btn-dark m-1" onClick={() => addProduct(product)}>
                    Add to Cart
                  </button>
                </div> */}
        </div>
      </div>
      </Link>
    </>
  );
}
