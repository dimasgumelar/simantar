import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { FaSave } from "react-icons/fa";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { DownloadDropdownButton } from "@/Components/Button";
import { inertiaGet } from "@/utils/helper-function";
import { BreadcrumbsJadwal } from "@/Pages/Schedules/Constant";

function buildMatrix(employees, entries) {
    const matrix = {};
    employees.forEach((employee) => {
        matrix[employee.user_id] = { ...(entries[employee.user_id] || {}) };
    });
    return matrix;
}

function normalizeSelection(anchor, focus) {
    return {
        minRow: Math.min(anchor.row, focus.row),
        maxRow: Math.max(anchor.row, focus.row),
        minCol: Math.min(anchor.col, focus.col),
        maxCol: Math.max(anchor.col, focus.col),
    };
}

function addMonthsToDateString(dateString, months) {
    const d = new Date(dateString + "T00:00:00");
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
}

function formatDayHeader(dateString) {
    const d = new Date(dateString + "T00:00:00");
    return {
        day: d.getDate(),
        month: d.toLocaleDateString("id-ID", { month: "short" }),
    };
}

export default function SchedulesShow({
    transmission,
    employees = [],
    startDate,
    endDate,
    dates = [],
    entries = {},
    shiftCodes = [],
    shiftLegend = null,
    canEdit = false,
    maxRangeMonths = 2,
}) {
    const breadcrumbs = [<BreadcrumbsJadwal />, transmission.name];

    const [rangeStart, setRangeStart] = useState(startDate);
    const [rangeEnd, setRangeEnd] = useState(endDate);
    const maxEndForStart = addMonthsToDateString(rangeStart, maxRangeMonths);

    const [matrix, setMatrix] = useState(() => buildMatrix(employees, entries));
    const [processing, setProcessing] = useState(false);

    const [anchor, setAnchor] = useState({ row: 0, col: 0 });
    const [focus, setFocus] = useState({ row: 0, col: 0 });
    const [isSelecting, setIsSelecting] = useState(false);
    const [editingCell, setEditingCell] = useState(null);
    const gridRef = useRef(null);

    const sel = normalizeSelection(anchor, focus);
    const isMultiSelection = sel.minRow !== sel.maxRow || sel.minCol !== sel.maxCol;

    useEffect(() => {
        function onMouseUp() {
            setIsSelecting(false);
        }
        window.addEventListener("mouseup", onMouseUp);
        return () => window.removeEventListener("mouseup", onMouseUp);
    }, []);

    function applyRange(newStart, newEnd) {
        inertiaGet(
            "schedules.show",
            { start_date: newStart, end_date: newEnd },
            { transmission: transmission.id }
        );
    }

    function handleDownloadCsv() {
        window.location.href = route("schedules.csv", {
            transmission: transmission.id,
            start_date: rangeStart,
            end_date: rangeEnd,
        });
    }

    function handleDownloadPdf() {
        window.location.href = route("schedules.pdf", {
            transmission: transmission.id,
            start_date: rangeStart,
            end_date: rangeEnd,
        });
    }

    function handleStartChange(e) {
        const newStart = e.target.value;
        if (!newStart) return;
        const maxEnd = addMonthsToDateString(newStart, maxRangeMonths);
        let newEnd = rangeEnd;
        if (newEnd < newStart) newEnd = newStart;
        if (newEnd > maxEnd) newEnd = maxEnd;
        setRangeStart(newStart);
        setRangeEnd(newEnd);
        applyRange(newStart, newEnd);
    }

    function handleEndChange(e) {
        let newEnd = e.target.value;
        if (!newEnd) return;
        const maxEnd = addMonthsToDateString(rangeStart, maxRangeMonths);
        if (newEnd > maxEnd) newEnd = maxEnd;
        if (newEnd < rangeStart) newEnd = rangeStart;
        setRangeEnd(newEnd);
        applyRange(rangeStart, newEnd);
    }

    function cellValue(row, col) {
        const employee = employees[row];
        const date = dates[col];
        return matrix[employee.user_id]?.[date] || "";
    }

    function setCellValue(row, col, value) {
        const employee = employees[row];
        const date = dates[col];
        setMatrix((prev) => ({
            ...prev,
            [employee.user_id]: {
                ...prev[employee.user_id],
                [date]: value,
            },
        }));
    }

    function isCellSelected(row, col) {
        return (
            row >= sel.minRow &&
            row <= sel.maxRow &&
            col >= sel.minCol &&
            col <= sel.maxCol
        );
    }

    function isActiveCell(row, col) {
        return row === focus.row && col === focus.col;
    }

    function selectionEdgeClasses(row, col) {
        if (!isCellSelected(row, col)) return "";
        const classes = ["bg-primary/30"];
        if (row === sel.minRow) classes.push("border-t-2 border-t-primary");
        if (row === sel.maxRow) classes.push("border-b-2 border-b-primary");
        if (col === sel.minCol) classes.push("border-l-2 border-l-primary");
        if (col === sel.maxCol) classes.push("border-r-2 border-r-primary");
        return classes.join(" ");
    }

    function selectCell(row, col) {
        setEditingCell(null);
        setAnchor({ row, col });
        setFocus({ row, col });
    }

    function handleCellMouseDown(row, col, e) {
        if (!canEdit) return;
        e.preventDefault();
        setEditingCell(null);
        setAnchor({ row, col });
        setFocus({ row, col });
        setIsSelecting(true);
        gridRef.current?.focus();
    }

    function handleCellMouseEnter(row, col) {
        if (!canEdit || !isSelecting) return;
        setFocus({ row, col });
    }

    function selectRow(row) {
        if (!canEdit) return;
        setEditingCell(null);
        setAnchor({ row, col: 0 });
        setFocus({ row, col: dates.length - 1 });
        gridRef.current?.focus();
    }

    function selectColumn(col) {
        if (!canEdit) return;
        setEditingCell(null);
        setAnchor({ row: 0, col });
        setFocus({ row: employees.length - 1, col });
        gridRef.current?.focus();
    }

    function openEditor(row, col) {
        if (!canEdit) return;
        setAnchor({ row, col });
        setFocus({ row, col });
        setEditingCell({ row, col });
    }

    function closeEditor() {
        setEditingCell(null);
        gridRef.current?.focus();
    }

    function clearSelection() {
        setMatrix((prev) => {
            const next = { ...prev };
            for (let row = sel.minRow; row <= sel.maxRow; row++) {
                const employee = employees[row];
                const userEntries = { ...(next[employee.user_id] || {}) };
                for (let col = sel.minCol; col <= sel.maxCol; col++) {
                    userEntries[dates[col]] = "";
                }
                next[employee.user_id] = userEntries;
            }
            return next;
        });
    }

    function fillSelection(value) {
        setMatrix((prev) => {
            const next = { ...prev };
            for (let row = sel.minRow; row <= sel.maxRow; row++) {
                const employee = employees[row];
                const userEntries = { ...(next[employee.user_id] || {}) };
                for (let col = sel.minCol; col <= sel.maxCol; col++) {
                    userEntries[dates[col]] = value;
                }
                next[employee.user_id] = userEntries;
            }
            return next;
        });
    }

    function pasteBlock(rows) {
        setMatrix((prev) => {
            const next = { ...prev };
            const validCodes = new Set(shiftCodes);

            for (let r = 0; r < rows.length; r++) {
                const row = sel.minRow + r;
                if (row > employees.length - 1) break;
                const employee = employees[row];
                const userEntries = { ...(next[employee.user_id] || {}) };

                for (let c = 0; c < rows[r].length; c++) {
                    const col = sel.minCol + c;
                    if (col > dates.length - 1) break;
                    const raw = rows[r][c].trim();
                    if (raw === "" || validCodes.has(raw)) {
                        userEntries[dates[col]] = raw;
                    }
                }
                next[employee.user_id] = userEntries;
            }
            return next;
        });
    }

    function handleGridKeyDown(e) {
        if (!canEdit || editingCell) return;

        const maxRow = employees.length - 1;
        const maxCol = dates.length - 1;

        const moveMap = {
            ArrowUp: [-1, 0],
            ArrowDown: [1, 0],
            ArrowLeft: [0, -1],
            ArrowRight: [0, 1],
        };

        if (moveMap[e.key]) {
            e.preventDefault();
            const [dRow, dCol] = moveMap[e.key];
            const newFocus = {
                row: Math.min(maxRow, Math.max(0, focus.row + dRow)),
                col: Math.min(maxCol, Math.max(0, focus.col + dCol)),
            };
            setFocus(newFocus);
            if (!e.shiftKey) {
                setAnchor(newFocus);
            }
            return;
        }

        if (e.key === "Tab") {
            e.preventDefault();
            const dCol = e.shiftKey ? -1 : 1;
            const newFocus = {
                row: focus.row,
                col: Math.min(maxCol, Math.max(0, focus.col + dCol)),
            };
            selectCell(newFocus.row, newFocus.col);
            return;
        }

        if (e.key === "Enter" || e.key === "F2") {
            e.preventDefault();
            openEditor(focus.row, focus.col);
            return;
        }

        if (e.key === "Delete" || e.key === "Backspace") {
            e.preventDefault();
            clearSelection();
            return;
        }
    }

    function handleCopy(e) {
        if (!canEdit || editingCell) return;
        e.preventDefault();
        const rows = [];
        for (let row = sel.minRow; row <= sel.maxRow; row++) {
            const cols = [];
            for (let col = sel.minCol; col <= sel.maxCol; col++) {
                cols.push(cellValue(row, col));
            }
            rows.push(cols.join("\t"));
        }
        e.clipboardData.setData("text/plain", rows.join("\n"));
    }

    function handleCut(e) {
        if (!canEdit || editingCell) return;
        handleCopy(e);
        clearSelection();
    }

    function handlePaste(e) {
        if (!canEdit || editingCell) return;
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        if (!text) return;

        let lines = text.replace(/\r/g, "").split("\n");
        if (lines.length > 1 && lines[lines.length - 1] === "") {
            lines.pop();
        }
        const rows = lines.map((line) => line.split("\t"));

        if (rows.length === 1 && rows[0].length === 1) {
            const raw = rows[0][0].trim();
            if (raw === "" || shiftCodes.includes(raw)) {
                fillSelection(raw);
            }
            return;
        }

        pasteBlock(rows);
    }

    function handleSave(e) {
        e.preventDefault();

        const submittedEntries = [];
        employees.forEach((employee) => {
            dates.forEach((date) => {
                const original = entries[employee.user_id]?.[date] || "";
                const current = matrix[employee.user_id]?.[date] || "";

                if (current || (original && !current)) {
                    submittedEntries.push({
                        user_id: employee.user_id,
                        date,
                        shift: current || null,
                    });
                }
            });
        });

        router.post(
            route("schedules.store", transmission.id),
            {
                start_date: rangeStart,
                end_date: rangeEnd,
                entries: submittedEntries,
            },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            }
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Jadwal Dinas - ${transmission.name}`} />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <Breadcrumbs list={breadcrumbs} />
                        <DownloadDropdownButton
                            options={[
                                { label: "PDF", onClick: handleDownloadPdf },
                                { label: "CSV", onClick: handleDownloadCsv },
                            ]}
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div className="text-sm text-base-content/70">
                            Admin Transmisi:{" "}
                            <span className="font-medium">
                                {transmission.admin_transmisi?.name ?? "-"}
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="join">
                                <input
                                    type="date"
                                    className="input input-bordered join-item w-40"
                                    value={rangeStart}
                                    onChange={handleStartChange}
                                />
                                <span className="join-item flex items-center px-3 border border-base-300 bg-base-200 text-sm text-base-content/60">
                                    s/d
                                </span>
                                <input
                                    type="date"
                                    className="input input-bordered join-item w-40"
                                    value={rangeEnd}
                                    min={rangeStart}
                                    max={maxEndForStart}
                                    onChange={handleEndChange}
                                />
                            </div>
                            <span className="text-xs text-base-content/50">
                                Rentang tanggal maksimal {maxRangeMonths}{" "}
                                bulan.
                            </span>
                        </div>
                    </div>

                    {employees.length === 0 ? (
                        <div className="text-center py-8 text-base-content/60">
                            Belum ada pegawai yang terhubung ke transmisi ini.
                        </div>
                    ) : (
                        <form onSubmit={handleSave}>
                            {canEdit && (
                                <p className="text-sm text-base-content/60 mb-2">
                                    Klik &amp; seret untuk pilih banyak sel.
                                    Ctrl+C / Ctrl+V untuk salin-tempel, Enter
                                    untuk ubah sel, Delete untuk mengosongkan.
                                </p>
                            )}
                            <div
                                ref={gridRef}
                                tabIndex={canEdit ? 0 : undefined}
                                className="overflow-x-auto outline-none"
                                onKeyDown={handleGridKeyDown}
                                onCopy={handleCopy}
                                onCut={handleCut}
                                onPaste={handlePaste}
                            >
                                <table className="table table-pin-rows select-none">
                                    <thead>
                                        <tr>
                                            <th className="sticky left-0 bg-base-200 z-20">
                                                Pegawai
                                            </th>
                                            {dates.map((date, colIndex) => {
                                                const { day, month } =
                                                    formatDayHeader(date);
                                                return (
                                                <th
                                                    key={date}
                                                    className={`text-center bg-base-200 leading-tight ${
                                                        canEdit
                                                            ? "cursor-pointer"
                                                            : ""
                                                    }`}
                                                    onMouseDown={() =>
                                                        selectColumn(colIndex)
                                                    }
                                                >
                                                    <div>{day}</div>
                                                    <div className="text-[10px] font-normal text-base-content/50">
                                                        {month}
                                                    </div>
                                                </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map(
                                            (employee, rowIndex) => (
                                                <tr key={employee.user_id}>
                                                    <th
                                                        className={`sticky left-0 bg-base-100 whitespace-nowrap z-10 ${
                                                            canEdit
                                                                ? "cursor-pointer"
                                                                : ""
                                                        }`}
                                                        onMouseDown={() =>
                                                            selectRow(rowIndex)
                                                        }
                                                    >
                                                        {employee.name}
                                                    </th>
                                                    {dates.map(
                                                        (date, colIndex) => {
                                                            const value =
                                                                cellValue(
                                                                    rowIndex,
                                                                    colIndex
                                                                );

                                                            if (!canEdit) {
                                                                return (
                                                                    <td
                                                                        key={
                                                                            date
                                                                        }
                                                                        className="p-1 text-center"
                                                                    >
                                                                        <span className="text-xs">
                                                                            {value ||
                                                                                "-"}
                                                                        </span>
                                                                    </td>
                                                                );
                                                            }

                                                            const selected =
                                                                isCellSelected(
                                                                    rowIndex,
                                                                    colIndex
                                                                );
                                                            const active =
                                                                isActiveCell(
                                                                    rowIndex,
                                                                    colIndex
                                                                );
                                                            const isEditing =
                                                                editingCell?.row ===
                                                                    rowIndex &&
                                                                editingCell?.col ===
                                                                    colIndex;

                                                            return (
                                                                <td
                                                                    key={date}
                                                                    className={`p-0 border border-base-300 ${
                                                                        selected
                                                                            ? selectionEdgeClasses(
                                                                                  rowIndex,
                                                                                  colIndex
                                                                              )
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {isEditing ? (
                                                                        <select
                                                                            autoFocus
                                                                            className="select select-xs w-24 h-8 min-h-0 rounded-none border-0 focus:outline-none"
                                                                            value={
                                                                                value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                setCellValue(
                                                                                    rowIndex,
                                                                                    colIndex,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                                closeEditor();
                                                                            }}
                                                                            onBlur={
                                                                                closeEditor
                                                                            }
                                                                            onKeyDown={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e.key ===
                                                                                    "Escape"
                                                                                ) {
                                                                                    closeEditor();
                                                                                }
                                                                            }}
                                                                        >
                                                                            <option value="">
                                                                                -
                                                                            </option>
                                                                            {shiftCodes.map(
                                                                                (
                                                                                    code
                                                                                ) => (
                                                                                    <option
                                                                                        key={
                                                                                            code
                                                                                        }
                                                                                        value={
                                                                                            code
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            code
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                        </select>
                                                                    ) : (
                                                                        <div
                                                                            className={`cursor-cell text-center text-xs w-24 h-8 flex items-center justify-center ${
                                                                                active &&
                                                                                isMultiSelection
                                                                                    ? "bg-primary/40"
                                                                                    : ""
                                                                            }`}
                                                                            onMouseDown={(
                                                                                e
                                                                            ) =>
                                                                                handleCellMouseDown(
                                                                                    rowIndex,
                                                                                    colIndex,
                                                                                    e
                                                                                )
                                                                            }
                                                                            onMouseEnter={() =>
                                                                                handleCellMouseEnter(
                                                                                    rowIndex,
                                                                                    colIndex
                                                                                )
                                                                            }
                                                                            onDoubleClick={() =>
                                                                                openEditor(
                                                                                    rowIndex,
                                                                                    colIndex
                                                                                )
                                                                            }
                                                                        >
                                                                            {value || (
                                                                                <span className="text-base-content/30">
                                                                                    -
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        }
                                                    )}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {shiftLegend && (
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-base-content/60">
                                    {Object.entries(shiftLegend).map(
                                        ([code, label]) => (
                                            <span key={code}>
                                                <span className="font-semibold">
                                                    {code}
                                                </span>{" "}
                                                = {label}
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                            {canEdit && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            <>
                                                <FaSave />
                                                Simpan
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
