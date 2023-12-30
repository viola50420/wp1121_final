import Skeleton from "react-loading-skeleton";

export default function Loading() {
  return (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {/* ...其他 Skeletal 元素... */}
    </>
  );
}
