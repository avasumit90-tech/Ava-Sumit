import { UserRecord, ProjectItem, ActivityItem, ApplicationStatus } from './types';

export const ASSETS = {
  logoCircle: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChXRIQ8gkj7GZdtIGn3wMY5Z5c8UPeurXtIhRZ9oljWyq8DougbFcjmAlqalfgLuaIz5kZyBdAcWIRtBWWIgBSIFIntm-jsPFxc9yd0vliV_N5U3CO_AVHGbFv2sbTr2Auz9fYdDKpzUEGVmBA6Ozn8l0C1o8yiZoVmwAlIHhEZHkfTjYucrSlLnD-T2V4sLE-c8PgYrj4VLu6jEupT9x2J157UIc_WslOWptyd7XQykMFeC3TqdDzs95WBee8oEJc',
  logoIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAosH4YQzdxRI8c4gzOoJEjybxlGRZgTHgjpM72bBUUq40oPjqM3pn0SAbCEBqTWBAs4b5cT38hi-3oMG_GUEqpiZltFfb1gdCppt983rIbTXCCgQtcjbIZ9zOKdUCxO9TYltMnxnpDWLBkgTz6_jB5QBivis1N2_XFWn2lfmbgV0Rsp3K5APv1dpJCaACEevOUcTC664H9hCi1jtJiSrXvInqwRe6gr3Owgsv6E293qnBvlSmuvZ0',
  rahulImpact: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABeMK7LCqo2pwGs6J1mVxkOde32i9UwL9F_9GIcx8mIq_Wlk9WFt6iiUdtCltYejZvaSbjTRVrEh0dxJ0ztvWsLvy1O8Oka88ADvWIeDGLI6jqcjniBKNcH680YePEZuLw_s-8iq4oFt40vwQchhfnlEuJEeP8PbBwyxle2-31m2V3TsrplyCJt6LGeTfxgaSMSpl9er_NHwvoncto84n3-AgC_EwEmTfpxOkRx_0gW5XILhwwPIE',
  adminAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7HI9bnU1znapI9JO7NZZzCtcXHhf8BSMMd4lkVN8mPzK7j_GSNZn5J21TcJnqasrQCHoUU30THA9W_td2HTV14MNycmLv8NVrgmys0ME4TA4d4NABauLu19YNMz_GGzNJ8hoWhxyMTIzECXVGH5Jct0ARN35XG_UWZVyjK2VLzG759oego7f4sHFuy_fGjtcSHuPxG-P6gkdTtHgT3jzCGiONWGvOddXIoGUCvO8mDYBvuzc60fA',
  rahulAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6glIu3Sm1e5_R0JWt25YeHqBcuki8aQTPcFQ3Qczi-r8jhfTOnJ_4B7s3eRHBkxBgOJo5HQj6YnkCiHzfqaL1oXu-Ocji5w2GPFFEzHtWREL1h-aN2NwPeDga5SeYFZplc7XqN2exdOlsi8hlUFbSrshL3OjLSnapCdKreNgTC2Kq50KCDtUffcoUA8RPCC6s13pR6J2MgqJKcXsWlgHx7LRJe8e3EvmuV9d73401esiPf2wkhUs',
  rahulIdPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-W_t-MnmwarDVj3gYzMPpSDBZPuVTyPPkWcvY6N70rq3p3SaIwLBXTpwPhb25jtcpPjtWELzinnj6UiT8bAlH4qlqtMi9JF3Ari8lvRTAmLIN2bNtEe3sRMxMaTbQ8vNVQGjEtN1v4ZdKvGTbjsefYjEsO9ecMdMy_8BNGBuM6mA8IdsOV6oGYD6BSZNodADI_ycaHc6wruoiwUUyZFCrD2z1DiKuYZyjFAcfGfgW20SBM1jZc8k',
  qrCode: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn6m5_Z4DzC7PtcFlCGgSZhZWLb7Wh9DTVFs-J_59sMQYuzqZW6vLDcomEXr4z1lAMahVsb5N_tb0eGOxEwCG84Go1nPqv1lr7RcfWjZqvz8GD1qYPrZ6JlIrd2sxNyGHzWL0cM3-qYU87ul_x_IV92BfTh6ggqRo6BfpkM3oFqXtKmzc8m27vgi1ebjNvfTPW452NTg4cKOFpWFaQmjCMMfDF7ci9F1g_TXirW6U0crQidtKw4Fg',
  priyaAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvsIjlaNv1lcLRUwC2pex42jGLZjV5UyTu93bf7lIlJXkcUTWxx42WQah25vJ305A_Qwrafpb-NqZrBTaokGA0XiDsHKBa_46zHQKsQNi71YjKfTd1YKmJ7xTUrfJQzZJ89k9grnSKZl1PeyWz9anI8xeapMOVsaslTtZJ6925D_3o_FZ41Bmh8qVlKWhEi6B8XLcPYGtUMumyRlPPXw1IcVLocKpNMpMK0Q5MCfztformXjuNxAA',
  sarahAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdAPik0wgsstMww5DLZxBKHMverbhRBi0FM2SQT_7B8vU1c5d3NRvABfycqcGAwWdFyaxLEIAP2McICsiYlPP4B3CUWt3F1iZdL28yXP5ONUZ77fOEvEkdxVKG-dLfpJdTI2zJRl-6UILWROnIp_RuI-jNVQ4uKBpZssVaA0LN6uEIvDZAxhJpNusoFJtUVZxY2foUJUvdIms14VWGkJ2jJqAsZcStXVSwFSzM-ZTyU7M9f4oXaBo',
  ruralEduProject: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE9db-hWbB7k37TlDOZ1_5P2OyDlmSAnuPzDgArUjH8ds2jCNsYjJiSEZVMbHq-usBxse-g-vJfJ92Uv2uFNJ0m7Nfg1x54La9Rpeuxlh-FRK5jjC3Xed5KzgW2vukqeXxEiDUZmjzwdvKGn-w801MBd1ThCqYfBBJn95Rf77SarcpRzo78tcRf74iquC-PllLfgSqY3gDUKU98Oy-4dPdmp-ZsRd_0nX-sGNU0BdT57yIvyZ-pSk',
  cleanWaterProject: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg3v5rCq99qI5L3eTM49mscg7dNanEhK5pASj0dMgLqXey_Cyvcf7rpO-tNh0VJYN430Mq5w0c7iT1r56FpSCAAR2Uxk01RDCjdkPJSei7GucI2lQlDHEQaXQmViEnyDswbKB8G2VgxjV3Z9VrdrFlmWzwsLdNh__8EC6RrU6yG_qXadKzWq0RlAL0JKjodnsLyprLWVRDjfJlxjHZN7aT39b2tzpO_5dZeqwPSO317j1I75knxE4',
  cardPatternBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIu1KI7312__u78cGU0fUsexOFVMfRpjIfqZm3Itnu-dKeVQc8PlGSlJj786a-vEIKxLYJGX7vuwM4OHqbXfzNiWeSvZjvW0bRJ7XE5FT9H5i3UttktdhlpCPT_bFOhVx-SCk9MpbKiZ8ZvfqAz5WzeROR7OrZ9Q7BMabchltlcmIhHx9EVO_ND3242j78-yRdcCUPX-td66h9oYM9Pz3ASOQPS6Zdj3kqQjAacYti3LmTa5cqg29FVwBlcCPLBCKq'
};

export const INITIAL_USERS: UserRecord[] = [
  {
    id: 'AST-2024-8902',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'Volunteer / Mentorship',
    location: 'Mumbai, MH',
    registrationDate: 'Oct 12, 2024',
    status: 'Active',
    avatar: ASSETS.rahulAvatar,
    phone: '+91 98765 43210',
    dob: '15/08/1998',
    bloodGroup: 'O+',
    validUntil: '31/12/2026',
    qualification: 'B.Tech Computer Science',
    organization: 'Tech Mahindra Foundation',
    department: 'Education',
    lastActive: 'Today, 10:15 AM'
  },
  {
    id: 'AST-DID-9012',
    name: 'Priya Verma',
    email: 'priya.v@example.com',
    role: 'Astha Didi',
    location: 'Pune, MH',
    registrationDate: 'Oct 14, 2024',
    status: 'Active',
    avatar: ASSETS.priyaAvatar,
    phone: '+91 98123 45678',
    dob: '22/04/1999',
    bloodGroup: 'B+',
    validUntil: '31/12/2026',
    qualification: 'M.A. Social Work',
    organization: 'Fergusson College',
    department: 'Health - Rural',
    lastActive: 'Today, 09:41 AM'
  },
  {
    id: 'AST-MAA-1024',
    name: 'Sunita Devi',
    email: 'sunita.devi@example.com',
    role: 'Astha Maa',
    location: 'Nagpur, MH',
    registrationDate: 'Oct 10, 2024',
    status: 'Active',
    avatar: ASSETS.adminAvatar,
    phone: '+91 97654 32109',
    dob: '12/11/1975',
    bloodGroup: 'A+',
    validUntil: '31/12/2026',
    qualification: 'Higher Secondary',
    organization: 'Self Employed / Community Leader',
    department: 'Community - Women',
    lastActive: 'Yesterday'
  },
  {
    id: 'AST-TCH-3341',
    name: 'Anil Kumar',
    email: 'anil.k@example.com',
    role: 'Teacher',
    location: 'Nashik, MH',
    registrationDate: 'Oct 08, 2024',
    status: 'Pending',
    avatar: undefined,
    phone: '+91 95432 10987',
    dob: '05/01/1988',
    bloodGroup: 'AB+',
    validUntil: '31/12/2025',
    qualification: 'B.Ed Mathematics',
    organization: 'Zilla Parishad High School',
    department: 'Education',
    lastActive: 'Oct 12, 2024'
  },
  {
    id: 'AST-STD-5512',
    name: 'Aarav Patel',
    email: 'aarav.p@example.com',
    role: 'Student',
    location: 'Thane, MH',
    registrationDate: 'Oct 18, 2024',
    status: 'Pending',
    avatar: undefined,
    phone: '+91 91234 56789',
    dob: '10/06/2006',
    bloodGroup: 'O+',
    validUntil: '31/12/2025',
    qualification: '12th Grade Student',
    organization: 'Thane Model School',
    department: 'Events',
    lastActive: 'Never'
  },
  {
    id: 'AST-COORD-88',
    name: 'Rajesh Deshmukh',
    email: 'rajesh.d@example.com',
    role: 'District/Block Coordinator',
    location: 'Chhatrapati Sambhajinagar, MH',
    registrationDate: 'Sep 28, 2024',
    status: 'Active',
    avatar: undefined,
    phone: '+91 98888 77766',
    dob: '18/03/1982',
    bloodGroup: 'B+',
    validUntil: '31/12/2027',
    qualification: 'M.B.A. Public Administration',
    organization: 'Astha Foundation Regional Wing',
    department: 'Management',
    lastActive: 'Today, 08:30 AM'
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'PRJ-01',
    title: 'Rural Education Initiative',
    category: 'Education',
    description: 'Providing digital classrooms, stationery, and dedicated mentors for over 500 children in remote villages.',
    raised: 45000,
    goal: 60000,
    image: ASSETS.ruralEduProject,
    status: 'Active'
  },
  {
    id: 'PRJ-02',
    title: 'Clean Water & Sanitation',
    category: 'Health',
    description: 'Installing solar-powered water purification units and building sanitation facilities in underprivileged schools.',
    raised: 20000,
    goal: 50000,
    image: ASSETS.cleanWaterProject,
    status: 'Active'
  }
];

export const INITIAL_APPLICATIONS: ApplicationStatus[] = [
  {
    id: 'AST-2024-8902',
    applicantName: 'Rahul Sharma',
    role: 'Youth Mentor / Volunteer',
    submittedDate: '12/10/2024',
    status: 'Approved',
    stepCompleted: 4,
    totalSteps: 4,
    remarks: 'Identity verified. Training badge issued.'
  },
  {
    id: 'AST-DID-9012',
    applicantName: 'Priya Verma',
    role: 'Astha Didi',
    submittedDate: '14/10/2024',
    status: 'Approved',
    stepCompleted: 4,
    totalSteps: 4,
    remarks: 'Community screening complete.'
  },
  {
    id: 'AST-MAA-1024',
    applicantName: 'Sunita Devi',
    role: 'Astha Maa',
    submittedDate: '10/10/2024',
    status: 'Approved',
    stepCompleted: 4,
    totalSteps: 4,
    remarks: 'Maternal health certification verified.'
  },
  {
    id: 'AST-TCH-3341',
    applicantName: 'Anil Kumar',
    role: 'Teacher',
    submittedDate: '08/10/2024',
    status: 'Under Review',
    stepCompleted: 3,
    totalSteps: 4,
    remarks: 'Awaiting B.Ed certificate verification.'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'ACT-1',
    title: 'Rahul Sharma registered as Volunteer',
    time: '10 mins ago',
    type: 'volunteer',
    icon: 'person_add'
  },
  {
    id: 'ACT-2',
    title: 'Received ₹2500 donation for Rural Education',
    time: '25 mins ago',
    type: 'donation',
    icon: 'payments'
  },
  {
    id: 'ACT-3',
    title: 'Clean Water Project reached 40% funding target',
    time: '2 hours ago',
    type: 'project',
    icon: 'water_drop'
  },
  {
    id: 'ACT-4',
    title: 'Priya Verma (Astha Didi) ID card generated',
    time: '4 hours ago',
    type: 'status',
    icon: 'badge'
  }
];
