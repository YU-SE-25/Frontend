import type {
  MySolvedCodeResponse,
  ReviewsResponse,
  ReviewComments,
} from "../solution_api";

// ===================== 더미 데이터 =====================
// ===================== ✅ 문제별 풀이 더미 =====================

const dummySolutions_problem1: MySolvedCodeResponse = {
  totalPages: 1,
  currentPage: 0,
  solutions: [
    {
      submissionId: 101,
      username: "gamppe",
      submittedAt: "2025-11-24T10:22:00Z",
      language: "CPP",
      runtime: 52,
      memory: 2048,
      code: `#include <bits/stdc++.h>
  using namespace std;
  int main(){
    int a,b; cin>>a>>b;
    cout<<a+b;
  }`,
    },
    {
      submissionId: 102,
      username: "python_king",
      submittedAt: "2025-11-25T09:11:00Z",
      language: "PYTHON",
      runtime: 38,
      memory: 2300,
      code: `a,b = map(int,input().split())
  print(a+b)`,
    },
    {
      submissionId: 103,
      username: "java_pro",
      submittedAt: "2025-11-26T14:01:00Z",
      language: "JAVA",
      runtime: 61,
      memory: 3100,
      code: `import java.util.*;
  public class Main {
    public static void main(String[] args){
      Scanner sc = new Scanner(System.in);
      int a = sc.nextInt();
      int b = sc.nextInt();
      System.out.println(a + b);
    }
  }`,
    },
  ],
};

const dummySolutions_problem2: MySolvedCodeResponse = {
  totalPages: 1,
  currentPage: 0,
  solutions: [
    {
      submissionId: 201,
      username: "speed_coder",
      submittedAt: "2025-11-24T08:41:00Z",
      language: "C",
      runtime: 85,
      memory: 1980,
      code: `#include <stdio.h>
  int main(){
    int n,x,a[100000];
    scanf("%d",&n);
    for(int i=0;i<n;i++) scanf("%d",&a[i]);
    scanf("%d",&x);
    int l=0,r=n-1;
    while(l<=r){
      int m=(l+r)/2;
      if(a[m]==x){ printf("1"); return 0; }
      if(a[m]<x) l=m+1;
      else r=m-1;
    }
    printf("0");
  }`,
    },
    {
      submissionId: 202,
      username: "binary_hunter",
      submittedAt: "2025-11-25T15:19:00Z",
      language: "CPP",
      runtime: 64,
      memory: 2450,
      code: `#include <bits/stdc++.h>
  using namespace std;
  int main(){
    int n,x; cin>>n;
    vector<int>a(n);
    for(int&i:a) cin>>i;
    cin>>x;
    cout<<(binary_search(a.begin(),a.end(),x)?1:0);
  }`,
    },
    {
      submissionId: 203,
      username: "algo_student",
      submittedAt: "2025-11-26T11:37:00Z",
      language: "PYTHON",
      runtime: 112,
      memory: 4100,
      code: `n = int(input())
  arr = list(map(int,input().split()))
  x = int(input())
  l,r = 0,n-1
  found = 0
  while l<=r:
    m=(l+r)//2
    if arr[m]==x:
      found=1; break
    elif arr[m]<x:
      l=m+1
    else:
      r=m-1
  print(found)`,
    },
  ],
};

const dummySolutions_problem3: MySolvedCodeResponse = {
  totalPages: 1,
  currentPage: 0,
  solutions: [
    {
      submissionId: 301,
      username: "pal_master",
      submittedAt: "2025-11-24T12:05:00Z",
      language: "PYTHON",
      runtime: 210,
      memory: 5200,
      code: `s = input().strip()
  n = len(s)
  ans = 1
  for i in range(n):
    l=r=i
    while l>=0 and r<n and s[l]==s[r]:
      ans = max(ans, r-l+1)
      l-=1; r+=1
    l=i; r=i+1
    while l>=0 and r<n and s[l]==s[r]:
      ans = max(ans, r-l+1)
      l-=1; r+=1
  print(ans)`,
    },
    {
      submissionId: 302,
      username: "cpp_algo",
      submittedAt: "2025-11-25T18:44:00Z",
      language: "CPP",
      runtime: 185,
      memory: 4800,
      code: `#include <bits/stdc++.h>
  using namespace std;
  int main(){
    string s; cin>>s;
    int n=s.size(), ans=1;
    for(int i=0;i<n;i++){
      int l=i,r=i;
      while(l>=0&&r<n&&s[l]==s[r]){
        ans=max(ans,r-l+1); l--; r++;
      }
      l=i; r=i+1;
      while(l>=0&&r<n&&s[l]==s[r]){
        ans=max(ans,r-l+1); l--; r++;
      }
    }
    cout<<ans;
  }`,
    },
    {
      submissionId: 303,
      username: "java_solver",
      submittedAt: "2025-11-26T20:12:00Z",
      language: "JAVA",
      runtime: 240,
      memory: 6100,
      code: `import java.util.*;
  public class Main{
    public static void main(String[] args){
      Scanner sc = new Scanner(System.in);
      String s = sc.next();
      int n=s.length(), ans=1;
      for(int i=0;i<n;i++){
        int l=i,r=i;
        while(l>=0&&r<n&&s.charAt(l)==s.charAt(r)){
          ans=Math.max(ans,r-l+1); l--; r++;
        }
        l=i; r=i+1;
        while(l>=0&&r<n&&s.charAt(l)==s.charAt(r)){
          ans=Math.max(ans,r-l+1); l--; r++;
        }
      }
      System.out.println(ans);
    }
  }`,
    },
  ],
};

const dummySolutions_Map: Record<number, MySolvedCodeResponse> = {
  1: dummySolutions_problem1,
  2: dummySolutions_problem2,
  3: dummySolutions_problem3,
};
// ===================== 리뷰 더미 =====================
export const dummyReviewsBySolution: Record<number, ReviewsResponse> = {
  // ========== problem 1 ==========
  101: {
    totalPages: 1,
    currentPage: 0,
    reviews: [
      {
        reviewId: 1,
        reviewer: "algo_master",
        lineNumber: 5,
        content: "입출력 처리 깔끔하고 불필요한 코드가 없어서 좋습니다.",
        voteCount: 12,
        createdAt: "2025-11-27T09:10:00Z",
        owner: false,
      },
      {
        reviewId: 2,
        reviewer: "clean_dev",
        lineNumber: 3,
        content: "변수명이 직관적이라 처음 보는 사람도 이해하기 쉽네요.",
        voteCount: 7,
        createdAt: "2025-11-27T09:15:00Z",
        owner: false,
      },
    ],
  },

  102: {
    totalPages: 1,
    currentPage: 0,
    reviews: [], // ✅ 리뷰 0개 케이스
  },

  103: {
    totalPages: 1,
    currentPage: 0,
    reviews: [
      {
        reviewId: 3,
        reviewer: "java_helper",
        lineNumber: 8,
        content: "Scanner 대신 BufferedReader를 쓰면 더 빨라질 수 있습니다.",
        voteCount: 5,
        createdAt: "2025-11-27T09:20:00Z",
        owner: false,
      },
    ],
  },

  // ========== problem 2 ==========
  201: {
    totalPages: 1,
    currentPage: 0,
    reviews: [
      {
        reviewId: 4,
        reviewer: "binary_fan",
        lineNumber: 14,
        content: "전형적인 이진 탐색 구현이라 학습용으로 좋습니다.",
        voteCount: 9,
        createdAt: "2025-11-27T09:25:00Z",
        owner: false,
      },
    ],
  },

  202: {
    totalPages: 1,
    currentPage: 0,
    reviews: [
      {
        reviewId: 5,
        reviewer: "cpp_style",
        lineNumber: 6,
        content: "STL을 잘 활용해서 코드가 매우 간결하네요.",
        voteCount: 11,
        createdAt: "2025-11-27T09:30:00Z",
        owner: false,
      },
      {
        reviewId: 6,
        reviewer: "memory_checker",
        lineNumber: 9,
        content: "입력 크기가 커질 때 메모리 사용량도 안정적입니다.",
        voteCount: 4,
        createdAt: "2025-11-27T09:31:00Z",
        owner: true,
      },
    ],
  },

  203: {
    totalPages: 1,
    currentPage: 0,
    reviews: [
      {
        reviewId: 7,
        reviewer: "python_mentor",
        lineNumber: 11,
        content: "파이썬에서도 이진 탐색을 직접 구현한 점이 좋네요.",
        voteCount: 6,
        createdAt: "2025-11-27T09:34:00Z",
        owner: false,
      },
      {
        reviewId: 8,
        reviewer: "edge_case",
        lineNumber: 3,
        content: "배열이 1개일 때도 정상 동작하는지 확인해보세요.",
        voteCount: 3,
        createdAt: "2025-11-27T09:36:00Z",
        owner: false,
      },
      {
        reviewId: 9,
        reviewer: "algo_student",
        lineNumber: 15,
        content:
          "while 조건이 조금 헷갈리는데 주석 추가하면 더 좋을 것 같아요.",
        voteCount: 2,
        createdAt: "2025-11-27T09:38:00Z",
        owner: true,
      },
    ],
  },

  // ========== problem 3 ==========
  301: {
    totalPages: 1,
    currentPage: 0,
    reviews: [
      {
        reviewId: 10,
        reviewer: "dp_expert",
        lineNumber: 7,
        content: "중심 확장 방식 구현이 아주 정확합니다.",
        voteCount: 14,
        createdAt: "2025-11-27T09:40:00Z",
        owner: false,
      },
    ],
  },

  302: {
    totalPages: 1,
    currentPage: 0,
    reviews: [], // ✅ 리뷰 없음
  },

  303: {
    totalPages: 1,
    currentPage: 0,
    reviews: [
      {
        reviewId: 11,
        reviewer: "gamppe",
        lineNumber: 10,
        content: "Java에서도 시간 제한을 안정적으로 통과하네요.",
        voteCount: 10,
        createdAt: "2025-11-27T09:45:00Z",
        owner: false,
      },
      {
        reviewId: 12,
        reviewer: "performance_tester",
        lineNumber: 18,
        content: "문자열 길이가 최대일 때도 성능 유지되는지 테스트해보세요.",
        voteCount: 6,
        createdAt: "2025-11-27T09:47:00Z",
        owner: false,
      },
    ],
  },
};

//리뷰 댓글 더미
export const dummyCommentsByReview: Record<number, ReviewComments> = {
  // ===== reviewId: 1 =====
  1: {
    totalPages: 1,
    currentPage: 0,
    comments: [
      {
        commentId: 1001,
        commenter: "junior_dev",
        content: "저도 이 방식으로 다시 한 번 풀어봐야겠네요!",
        createdAt: "2025-11-27T10:01:00Z",
        owner: false,
      },
      {
        commentId: 1002,
        commenter: "algo_master",
        content: "도움이 되었다니 다행입니다 🙂",
        createdAt: "2025-11-27T10:03:00Z",
        owner: true,
      },
    ],
  },

  // ===== reviewId: 2 =====
  2: {
    totalPages: 1,
    currentPage: 0,
    comments: [],
  },

  // ===== reviewId: 3 =====
  3: {
    totalPages: 1,
    currentPage: 0,
    comments: [
      {
        commentId: 1003,
        commenter: "java_beginner",
        content: "BufferedReader 예제 코드도 공유해주실 수 있나요?",
        createdAt: "2025-11-27T10:06:00Z",
        owner: false,
      },
    ],
  },

  // ===== reviewId: 4 =====
  4: {
    totalPages: 1,
    currentPage: 0,
    comments: [
      {
        commentId: 1004,
        commenter: "algo_student",
        content: "정석적인 구현이라서 이해하기 정말 좋았어요.",
        createdAt: "2025-11-27T10:10:00Z",
        owner: false,
      },
    ],
  },

  // ===== reviewId: 5 =====
  5: {
    totalPages: 1,
    currentPage: 0,
    comments: [
      {
        commentId: 1005,
        commenter: "stl_lover",
        content: "binary_search 함수 써도 성능 차이 거의 없겠죠?",
        createdAt: "2025-11-27T10:12:00Z",
        owner: false,
      },
      {
        commentId: 1006,
        commenter: "cpp_style",
        content: "네, 이 문제 크기에서는 거의 차이 없습니다!",
        createdAt: "2025-11-27T10:13:00Z",
        owner: true,
      },
    ],
  },

  // ===== reviewId: 6 =====
  6: {
    totalPages: 1,
    currentPage: 0,
    comments: [],
  },

  // ===== reviewId: 7 =====
  7: {
    totalPages: 1,
    currentPage: 0,
    comments: [
      {
        commentId: 1007,
        commenter: "python_newbie",
        content: "파이썬으로도 충분히 빠르네요!",
        createdAt: "2025-11-27T10:17:00Z",
        owner: false,
      },
    ],
  },

  // ===== reviewId: 8 =====
  8: {
    totalPages: 1,
    currentPage: 0,
    comments: [],
  },

  // ===== reviewId: 9 =====
  9: {
    totalPages: 1,
    currentPage: 0,
    comments: [
      {
        commentId: 1008,
        commenter: "logic_checker",
        content: "while 조건에서 = 포함한 이유가 궁금합니다.",
        createdAt: "2025-11-27T10:20:00Z",
        owner: false,
      },
      {
        commentId: 1009,
        commenter: "algo_student",
        content: "경계 값 비교 때문에 넣었습니다!",
        createdAt: "2025-11-27T10:21:00Z",
        owner: true,
      },
    ],
  },

  // ===== reviewId: 10 =====
  10: {
    totalPages: 1,
    currentPage: 0,
    comments: [],
  },

  // ===== reviewId: 11 =====
  11: {
    totalPages: 1,
    currentPage: 0,
    comments: [
      {
        commentId: 1010,
        commenter: "java_fan",
        content: "시간 제한 통과한 게 신기하네요!",
        createdAt: "2025-11-27T10:25:00Z",
        owner: false,
      },
    ],
  },

  // ===== reviewId: 12 =====
  12: {
    totalPages: 1,
    currentPage: 0,
    comments: [
      {
        commentId: 1011,
        commenter: "gamppe",
        content: "최악의 경우에도 0.2초면 충분하겠네요.",
        createdAt: "2025-11-27T10:28:00Z",
        owner: false,
      },
      {
        commentId: 1012,
        commenter: "java_solver",
        content: "네, 최대 입력에서도 여유 있었습니다.",
        createdAt: "2025-11-27T10:29:00Z",
        owner: true,
      },
    ],
  },
};

// ===================== 더미 API 구현 =====================

export async function fetchSolvedCode(
  problemId: number
): Promise<MySolvedCodeResponse> {
  const list = dummySolutions_Map[problemId] ?? {
    totalPages: 0,
    currentPage: 0,
    solutions: [],
  };

  if (list.solutions.length === 0) {
    throw new Error("해당 문제에 대한 풀이가 없습니다.");
  }

  return list;
} // solutionId(=submissionId)로 리뷰 목록 가져오기
export async function fetchReviewsBySolution(
  submissionId: number
): Promise<ReviewsResponse> {
  const data = dummyReviewsBySolution[submissionId];

  if (!data) {
    return {
      totalPages: 0,
      currentPage: 0,
      reviews: [],
    };
  }

  return data;
}

// reviewId로 댓글 목록 가져오기
export async function fetchCommentsByReview(
  reviewId: number
): Promise<ReviewComments> {
  const data = dummyCommentsByReview[reviewId];

  if (!data) {
    return {
      totalPages: 0,
      currentPage: 0,
      comments: [],
    };
  }

  return data;
}
