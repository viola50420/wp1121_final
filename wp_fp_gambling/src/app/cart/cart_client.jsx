import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5 text-black mb-2 font-bold">Your Cart is Empty</h4>
          <Link href="/" className="btn  btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Gambling
          </Link>
        </div>
      </div>
    </div>
  );
}
