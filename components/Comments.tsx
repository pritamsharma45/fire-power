// Componet to display comments
// Props: comments: Array of comments to display, with each comment having the following properties
//        - id: number
//        - comment: string
//        - user: string
//        - date: string

export default function Comments({ comments }) {
    return (
        <div>
        <div className="text-lg mt-4 underline">Comments</div>
        <div className="mt-4 inline-flex max-w-full">
            <input
            className="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="text"
            name="comment"
            placeholder="Add comment.."
            />
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3  w-40 h-8 rounded-full">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="inline h-5 w-5"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
            </svg>
            <span className="inline ml-2 text-xs">Add</span>
            </button>
        </div>
        <ul>
            {comments.map((comment) => (
            <li className="mt-4">
                <div className="flex">
                <div className="flex flex-col">
                    <div className="text-sm font-bold">{comment.user}</div>
                    <div className="text-xs text-gray-400">{comment.date}</div>
                </div>
                <div className="ml-4">{comment.comment}</div>
                </div>
            </li>
            ))}
        </ul>
        </div>
    ); 
    }

//     <div class="flex flex-col space-y-1">
//   <div class="flex items-center">
//     <div class="font-medium text-gray-800">John Doe</div>
//     <div class="ml-2 text-sm text-gray-600">February 24, 2023</div>
//   </div>
//   <div class="text-gray-700 text-xs">
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie euismod felis non euismod. Nulla facilisi. Donec euismod ex ut elit varius, vel venenatis odio interdum."
//   </div>
// </div>



