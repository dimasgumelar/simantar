import {
    parseStatus,
    parseStatusClass,
    parseCondition,
    parseConditionClass,
} from "@/utils/helper-function";
import { BADGE_LIST } from "@/utils/constants";

export function BadgeStatus({ param = "" }) {
    return (
        <span
            className={`badge badge-outline truncate block w-[140px] text-center ${parseStatusClass(
                param
            )}`}
        >
            {parseStatus(param)}
        </span>
    );
}

export function BadgeCondition({ param = "" }) {
    return (
        <span
            className={`badge badge-outline truncate block ${parseConditionClass(
                param
            )}`}
        >
            {parseCondition(param)}
        </span>
    );
}

export function BadgeRole({ roles = [] }) {
    return (
        <>
            {roles.map((role) => (
                <span
                    key={role.id}
                    className={`badge badge-outline truncate block ${
                        BADGE_LIST[role.id - (1 % BADGE_LIST.length)]
                    }`}
                >
                    {role.name}
                </span>
            ))}
        </>
    );
}
