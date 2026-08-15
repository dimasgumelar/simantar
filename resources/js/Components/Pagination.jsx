import { PAGE_SIZES } from "@/utils/constants";
import { router } from "@inertiajs/react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

export default function Pagination({
    perPage = 10,
    handlePerPageChange,
    data = [],
}) {
    function renderLabel(label) {
        if (label.includes("Previous")) return <FaAngleDoubleLeft />;
        if (label.includes("Next")) return <FaAngleDoubleRight />;
        return label;
    }

    return (
        <div className="my-4 flex">
            <select
                value={perPage}
                onChange={handlePerPageChange}
                className="select w-20"
            >
                {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
            <div className="join ml-4">
                {data.map((link, index) => (
                    <button
                        key={index}
                        className={`join-item btn ${
                            link.active ? "btn-active" : ""
                        } ${!link.url ? "btn-disabled" : ""}`}
                        onClick={() => {
                            if (link.url) {
                                router.get(
                                    link.url,
                                    {},
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    }
                                );
                            }
                        }}
                    >
                        {renderLabel(link.label)}
                    </button>
                ))}
            </div>
        </div>
    );
}
