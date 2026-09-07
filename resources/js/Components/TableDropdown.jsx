export default function TableDropdown({
    title = "Select",
    icon,
    list = [],
    selectedList = [],
    toggleItem,
    keyId = "id",
    keyValue = "name",
    size = "",
}) {
    return (
        <div className="dropdown ml-2">
            <div tabIndex={0} role="button" className={`btn btn-neutral ${size}`}>
                {icon}
                <span className="hidden sm:flex">{title}</span>
            </div>
            <div
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
                <div
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                    {list.map((value, index) => (
                        <div
                            className="flex flex-row items-center py-2"
                            key={index}
                        >
                            <input
                                type="checkbox"
                                checked={selectedList.includes(value[keyId])}
                                className="checkbox"
                                onChange={() => toggleItem(value[keyId])}
                            />
                            <span className="ml-2">{value[keyValue]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
