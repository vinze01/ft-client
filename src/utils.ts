export function getFullName(user: { firstName: string; middleName?: string; lastName: string }): string {
    const { firstName, middleName, lastName } = user;
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
}