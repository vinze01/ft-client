function getFullName(user: { firstName: string | null; middleName?: string | null; lastName: string | null }): string {
    const { firstName, middleName, lastName } = user;
    return [firstName, middleName, lastName].filter(Boolean).join(' ') || 'Guest';
}

function getGreetings(): string {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 18) return "Good Afternoon";
    return "Good Evening";
}

function getInitials (user: { firstName: string | null; lastName: string | null }): string {
    let {firstName, lastName} = user
    let initials = ""
    initials = firstName.toUpperCase().substring(0,1)
    initials += lastName.toUpperCase().substring(0,1)
    return initials
    
}

export { getFullName, getGreetings, getInitials };
